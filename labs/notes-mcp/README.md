# notes-mcp

A tiny MCP server that keeps notes in one JSON file. It uses the official MCP TypeScript SDK v2 and needs only Node.js: no network, no account, no API key.

Used in Chapters [08](../../chapters/08-mcp-fundamentals/README.md), [09](../../chapters/09-build-an-mcp-server/README.md), [11](../../chapters/11-mcp-security/README.md) and [12](../../chapters/12-capstone-plugin/README.md).

| It offers | Name |
|---|---|
| Tools | `add_note(title, text)`, `list_notes()`, `search_notes(query)`, `delete_note(title)` |
| Resource | `notes://all` (every note as Markdown) |
| Prompt | `summarize_notes` |

Notes are stored in `notes.json` in this folder. The server never writes anywhere else.

## Run it

From `labs/notes-mcp` (same on macOS, Linux and Windows):

```bash
npm install
npm run build
npm test
```

You should see: `ℹ pass 4` and `ℹ fail 0`.

## Look inside

```bash
npm run list
npm run demo
```

`list` prints the four tools, the resource and the prompt. `demo` prints every JSON-RPC message while it adds one note and deletes it again.

## Connect it to Claude Code

From `labs/notes-mcp`, on macOS or Linux:

```bash
claude mcp add --transport stdio notes -- node "$PWD/dist/stdio.js"
```

On Windows, use `"$PWD\dist\stdio.js"` in PowerShell or `"%CD%\dist\stdio.js"` in cmd. Then start `claude` and run `/mcp`.

You should see: `notes` listed as connected.

[Chapter 09](../../chapters/09-build-an-mcp-server/README.md) also runs the same server over HTTP (`npm run start:http`). Remove the server afterwards with `claude mcp remove notes`.

## Files

| File | Role |
|---|---|
| `src/notes.ts` | The server: storage, tools, resource, prompt |
| `src/stdio.ts` | Runs the server over stdio |
| `src/http.ts` | Runs the server over Streamable HTTP on 127.0.0.1, with a bearer token |
| `src/auth.ts` | The token check |
| `src/rpc.ts` | A tiny hand-written MCP client used by `list` and `demo` |
| `src/list.ts` | Lists the server's tools, resources and prompts |
| `src/wire-demo.ts` | Plays the host and prints raw messages |
| `src/notes.test.ts` | Small tests (`npm test`) |

The folder is also a Claude Code plugin, `notes-kit`, used in [Chapter 12](../../chapters/12-capstone-plugin/README.md). You can ignore these files until then:

| File | Role |
|---|---|
| `.claude-plugin/plugin.json` | The manifest. It also declares the MCP server. |
| `skills/notes-review/SKILL.md` | A skill that reviews your notes |
| `hooks/hooks.json` + `src/guard-delete.ts` + `src/pinned.ts` | A hook that refuses to delete pinned notes |

`npm run lint` type-checks the code without building it.
