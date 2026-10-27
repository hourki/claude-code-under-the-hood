# 09 — Build your own MCP server (TypeScript)

**In short:** you'll build a small notes server, watch its raw messages, and plug it into Claude Code.
All you need is Node.js, and it takes about 10 minutes.

**You'll learn:**

- how a few lines of TypeScript become MCP tools, a resource and a prompt
- how to connect a local server to Claude Code
- what changes, and what doesn't, when the same server moves to HTTP

| Part | Transport | You need |
|---|---|---|
| [Part 1](#part-1-stdio) | stdio (a local process) | Node.js |
| [Part 2](#part-2-streamable-http-on-localhost) | Streamable HTTP on `127.0.0.1` | Node.js |

Code: [`labs/notes-mcp`](https://github.com/hourki/claude-code-under-the-hood/tree/main/labs/notes-mcp). It uses the official MCP TypeScript SDK v2 (`@modelcontextprotocol/server`).

## Before you start

```bash
node --version
claude --version
```

You should see: `v22` or higher for Node.js, then a Claude Code version number. If a command isn't found, install the LTS version from [nodejs.org](https://nodejs.org), or Claude Code from its [overview page](https://code.claude.com/docs/en/overview).

## Part 1: stdio

### Step 1: build and test

Same commands on macOS, Linux and Windows:

```bash
cd labs/notes-mcp
npm install
npm run build
npm test
```

You should see, near the end: `ℹ pass 4` and `ℹ fail 0`.

### Step 2: watch the raw protocol

```bash
npm run demo
```

You should see about 300 lines that start like this:

```
=== 1. CONNECT (the 2025-era handshake, which this server still accepts) ===

➡  HOST → SERVER
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
```

The demo plays the host's role. It starts the server as a child process and writes JSON-RPC to its stdin. Here's the whole run:

```
HOST (wire demo)                            SERVER (notes)
  │── initialize ────────────────────────────▶│
  │◀── result {capabilities: tools, resources, prompts}
  │── notifications/initialized ─────────────▶│   no id, no reply
  │── tools/list, resources/list, prompts/list ▶│  discovery, once
  │── tools/call add_note ───────────────────▶│   every use
  │── resources/read notes://all ────────────▶│
  │── prompts/get summarize_notes ───────────▶│
  │── tools/call delete_note (twice) ────────▶│   2nd reply: isError: true
```

The demo uses the legacy `initialize` handshake because it's the easiest to read. The server also speaks spec `2026-07-28`, and `serveStdio` (the SDK's stdio runner) picks the right one for each client.

### Step 3: connect it to Claude Code

Run this from inside `labs/notes-mcp`.

macOS / Linux:

```bash
claude mcp add --transport stdio notes -- node "$PWD/dist/stdio.js"
```

Windows (PowerShell):

```powershell
claude mcp add --transport stdio notes -- node "$PWD\dist\stdio.js"
```

Windows (cmd):

```bat
claude mcp add --transport stdio notes -- node "%CD%\dist\stdio.js"
```

Everything after `--` is the command Claude Code runs to start your server, and `$PWD` makes the path absolute. The default scope is `local`: the server is yours, for this folder only.

```bash
claude mcp get notes
```

You should see: the `notes` entry with its command. Now start `claude` in the same folder and run `/mcp`.

You should see: `notes` listed as connected.

### Step 4: use it

Try these, one at a time:

| You type | What happens |
|---|---|
| *"Add a note titled groceries: milk, eggs, coffee."* | Claude calls `mcp__notes__add_note`. In Manual mode, you get a permission prompt the first time. |
| *"Search my notes for coffee."* | Claude calls `mcp__notes__search_notes`. |
| `@notes:notes://all` | Attaches the resource: every note, as Markdown. |
| `/mcp__notes__summarize_notes` | Runs the prompt. It also shows in the `/` menu as `/notes:summarize_notes (MCP)`. |

Open `notes.json` in the folder. You should see your groceries note in it.

In Manual mode, tired of the prompt for read-only tools? Add this to `.claude/settings.json`:

```json
{ "permissions": { "allow": ["mcp__notes__list_notes", "mcp__notes__search_notes"] } }
```

### How the code maps to MCP

Here's one tool from `src/notes.ts`:

```ts
server.registerTool(
  "search_notes",
  {
    description: "Find notes whose title or text contains the query (not case-sensitive).",
    inputSchema: z.object({ query: z.string().min(1).describe("Word or phrase to look for") }),
  },
  async ({ query }) => {
    const q = query.toLowerCase();
    const hits = loadNotes().filter((n) => `${n.title}\n${n.text}`.toLowerCase().includes(q));
    return reply(hits.length ? asMarkdown(hits) : `No notes match "${query}".`);
  },
);
```

| Code | Protocol |
|---|---|
| name, description, `inputSchema` | What `tools/list` returns. The zod schema becomes JSON Schema. |
| the `async` handler | What runs on `tools/call` |
| `registerResource("all-notes", "notes://all", ...)` | Shows in `resources/list`, served by `resources/read` |
| `registerPrompt("summarize_notes", ...)` | Shows in `prompts/list`, served by `prompts/get` |

zod is a small library that checks inputs: here, that `query` is a non-empty string. The SDK runs that check before your handler.

### What the demo teaches

| You saw | Lesson |
|---|---|
| `tools/list` once, `tools/call` per use | Discovery happens once per connection. Each use is one call. |
| `notes.json` changed | The server process does the work. The host only passes the call on. |
| `[notes] ready on stdio` printed separately | Logs go to stderr. stdout is reserved for JSON-RPC. |
| Every reply carries the request's `id` | That's how the host matches replies to requests. |
| The 2nd `delete_note` returned `isError: true` | A tool execution error. The model reads it and can recover. |

Two more error cases behave as the spec says: an unknown tool name gets a JSON-RPC `error` (code `-32602`), and bad input, like an empty `title`, gets `isError: true` with the validation message.

### Security

- The server only ever touches `notes.json` in its own folder. The path comes from the server's own location, never from input.
- The Bash sandbox doesn't cover MCP servers. Your server runs with your user's rights.
- Note text is data that the model reads, and a note could contain hostile instructions.

## Part 2: Streamable HTTP on localhost

Same server, new transport. `src/http.ts` reuses the same `createServer()` function and serves it over HTTP on `127.0.0.1`, behind a bearer token (a secret sent in the `Authorization` header).

**1. Make a throwaway token and start the server.**

macOS / Linux:

```bash
export NOTES_TOKEN=$(node -e "console.log(require('crypto').randomBytes(24).toString('hex'))")
echo $NOTES_TOKEN
npm run start:http
```

Windows (PowerShell):

```powershell
$env:NOTES_TOKEN = node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
$env:NOTES_TOKEN
npm run start:http
```

You should see: `[notes] listening on http://127.0.0.1:3333/mcp`.

**2. Connect Claude Code.** In a second terminal, with your token in place of `<token>`:

```bash
claude mcp add --transport http notes-http http://127.0.0.1:3333/mcp --header "Authorization: Bearer <token>"
```

Start `claude`, run `/mcp`, and try the same prompts as in Part 1.

**3. See the guard work (optional).** Send a request with no token:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://127.0.0.1:3333/mcp
```

You should see: `401`. (On Windows, use `curl.exe` and `-o NUL`.)

The checks in front of the MCP handler:

```ts
const rejected =
  hostHeaderValidationResponse(request, localhostAllowedHostnames()) ??
  originValidationResponse(request, localhostAllowedOrigins());
if (rejected) return rejected;
if (!hasValidToken(request.headers.get("authorization"), TOKEN)) {
  return new Response("Unauthorized", { status: 401, headers: { "WWW-Authenticate": "Bearer" } });
}
return mcp.fetch(request);
```

The `Host` and `Origin` checks stop a web page in your browser from reaching the server, an attack called DNS rebinding. The token check stops other programs that don't know the secret.

**What changed:** the transport (a URL instead of a child process) and auth (the token). **What stayed:** the tools, the resource, the prompt and every message. A static token is fine on your own machine, but for a shared server the MCP spec's answer is OAuth 2.1.

## Clean up

```bash
claude mcp remove notes
claude mcp remove notes-http
```

Stop the HTTP server with `Ctrl+C`. Delete `notes.json` if you want your notes gone.

## Common mistakes

| Mistake | Reality |
|---|---|
| Debug output with `console.log` in a stdio server | It goes to stdout and breaks JSON-RPC. Use `console.error`. |
| A relative path in `claude mcp add` | Use the absolute path (`$PWD/...`), so the command works from anywhere. |
| Skipping `npm run build` | `dist/stdio.js` doesn't exist, so the server can't start. |
| Throwing on a failed operation | Return `isError: true` with a message, so the model can recover. |
| Leaving the token in your config | `--header` stores it in your Claude Code config. Use a throwaway token and remove the server after. |

**Remember:**

- A tool is a name, a description, an input schema and a handler.
- The server does the work. The host routes and checks.
- stdout belongs to the protocol. Log to stderr.
- Moving to HTTP changes the transport and auth, not the tools.

Test yourself with the [quiz](quiz.md): 5 questions.

## Sources

Checked against these pages on 2026-10-27. If they disagree with this chapter, trust them.

- MCP quickstart, build a server: https://modelcontextprotocol.io/docs/2026-07-28/develop/build-server
- MCP TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
- MCP stdio transport: https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/stdio
- MCP Streamable HTTP transport: https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http
- Claude Code MCP: https://code.claude.com/docs/en/mcp
- Permission modes: https://code.claude.com/docs/en/permission-modes#which-mode-a-session-starts-in
