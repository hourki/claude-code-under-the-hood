// Part 2: the same notes server over Streamable HTTP, on this machine only, behind a bearer token.
import http from "node:http";
import {
  createMcpHandler,
  hostHeaderValidationResponse,
  localhostAllowedHostnames,
  localhostAllowedOrigins,
  originValidationResponse,
} from "@modelcontextprotocol/server";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { hasValidToken } from "./auth.js";
import { createServer } from "./notes.js";

const PORT = Number(process.env.PORT ?? 3333);
const TOKEN = process.env.NOTES_TOKEN;
if (!TOKEN) {
  console.error("[notes] Set NOTES_TOKEN first (see the README).");
  process.exit(1);
}

const mcp = createMcpHandler(() => createServer());

const handle = toNodeHandler({
  async fetch(request) {
    // Only accept localhost Host and Origin headers. This stops a web page from reaching the server (DNS rebinding).
    const rejected =
      hostHeaderValidationResponse(request, localhostAllowedHostnames()) ??
      originValidationResponse(request, localhostAllowedOrigins());
    if (rejected) return rejected;
    if (!hasValidToken(request.headers.get("authorization"), TOKEN)) {
      return new Response("Unauthorized", { status: 401, headers: { "WWW-Authenticate": "Bearer" } });
    }
    return mcp.fetch(request);
  },
});

const httpServer = http.createServer((req, res) => {
  if (req.url === "/mcp") handle(req, res);
  else res.writeHead(404).end();
});
httpServer.listen(PORT, "127.0.0.1", () => console.error(`[notes] listening on http://127.0.0.1:${PORT}/mcp`));
