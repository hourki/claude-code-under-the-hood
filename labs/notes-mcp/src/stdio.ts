// Entry point for stdio: Claude Code starts this process and talks JSON-RPC over stdin/stdout.
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createServer } from "./notes.js";

// stdout carries the protocol, so every log line goes to stderr.
serveStdio(() => createServer(), { onerror: (error) => console.error("[notes]", error) });
console.error("[notes] ready on stdio");
