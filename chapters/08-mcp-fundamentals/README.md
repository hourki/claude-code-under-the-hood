# 08 — MCP fundamentals

**In short:** MCP, the standard way for an agent to plug into outside tools and data, has a few parts that fit together the same way every time.
Learn them once, and any MCP server makes sense at a glance.

**You'll learn:**

- the roles: host, client, server
- the three things a server offers, and who controls each
- how messages travel, and how the protocol changed in 2026

## A server, listed

```
Server: notes, protocol 2025-11-25

Tools (the model decides when to call them):
  add_note — Save a note. A note with the same title is replaced.
  list_notes — List the titles of all notes.
  search_notes — Find notes whose title or text contains the query (not case-sensitive).
  delete_note — Delete the note with this exact title.

Resources (the app or you attach them):
  notes://all — All notes

Prompts (you pick them):
  summarize_notes — Ask the model to summarize every note.
```

That's the real output of `npm run list` in [`labs/notes-mcp`](https://github.com/hourki/claude-code-under-the-hood/tree/main/labs/notes-mcp). It asked the server three questions (`tools/list`, `resources/list`, `prompts/list`) and printed the answers. You'll run it in the hands-on below.

## Roles

| Role | What it is | In Claude Code |
|---|---|---|
| Host | The AI app you use. It coordinates everything. | Claude Code itself |
| Client | The piece inside the host that holds one connection to one server | One per server you add |
| Server | A program that offers tools, resources or prompts | `notes`, GitHub, a database server... |

MCP has two layers. The **data layer** is the JSON-RPC messages: what to ask and what comes back. The **transport layer** is how those messages travel, plus connection setup and auth, and the messages look the same on every transport.

## The three server primitives

A primitive is one kind of thing a server can offer.

| Primitive | Who controls it | Methods | In Claude Code |
|---|---|---|---|
| Tools | The model: it decides when to call one | `tools/list`, `tools/call` | Called as `mcp__<server>__<tool>` |
| Resources | The app: it decides what to attach | `resources/list`, `resources/read` | Type `@server:uri`, like `@notes:notes://all` |
| Prompts | You: you pick when to use one | `prompts/list`, `prompts/get` | Run `/mcp__server__prompt`, or pick it from the `/` menu |

- Every resource has a URI (an address), like `notes://all`.
- A server declares a capability for each primitive it offers, such as `tools`.
- The spec says a human should be able to deny any tool call. That's what Claude Code's permission prompts are for.

## Client features

The client can offer features to the server too. In spec `2026-07-28`:

| Feature | What it does | Status |
|---|---|---|
| Elicitation | The server asks the user a question mid-call | Current. Servers must never ask for passwords or API keys in a form. They send you to a URL instead. |
| Roots | Tells a server which folders to work in | Deprecated |
| Sampling | The server asks the client's model for a completion | Deprecated |
| Logging | Log messages over MCP | Deprecated. On stdio, log to stderr. |

## Transports

| | stdio | Streamable HTTP |
|---|---|---|
| Who starts the server | The client, as a child process | It's already running at a URL |
| How messages travel | One JSON message per line on stdin and stdout | Each message is an HTTP POST to one endpoint, like `/mcp` |
| Logging | Only to stderr. stdout is for MCP messages. | Normal server logs |
| Security basics | Runs with your user's rights | Check the `Origin` header, listen only on `127.0.0.1` when local, require auth |

## How the protocol changed in 2026

Spec `2026-07-28` is **stateless**: there's no `initialize` handshake any more. Every request carries its protocol version and the client's capabilities in `_meta`. A client can also ask `server/discover` what a server supports.

Over HTTP, sessions are gone too, and each POST carries headers like `MCP-Protocol-Version`. Change notifications, such as "the tool list changed", now arrive on a stream the client opens with `subscriptions/listen`.

Versions `2025-11-25` and earlier are called "legacy", and they start with the `initialize` handshake. The `list` script uses it, which is why its output says `protocol 2025-11-25`.

**Claude Code speaks both.** As of October 2026, its default MCP client (built on MCP TypeScript SDK 2.0) asks stdio and HTTP servers whether they speak `2026-07-28`, and keeps the legacy handshake for the others ([docs](https://code.claude.com/docs/en/mcp#mcp-client-runtimes)).

## Two kinds of errors

| Kind | Looks like | Example |
|---|---|---|
| Protocol error | A JSON-RPC `error` object | Unknown tool name, malformed request |
| Tool execution error | A normal result with `isError: true` | Invalid input (wrong date format), a failed operation |

The spec says clients SHOULD pass tool execution errors to the model, so it can read the text and correct itself.

## The Claude Code side

| Task | How |
|---|---|
| Add a local server | `claude mcp add --transport stdio <name> -- <command> [args...]` |
| Add a remote server | `claude mcp add --transport http <name> <url>`, plus `--header "Authorization: Bearer ..."` if needed |
| Pick who gets it | `--scope local` (default: you, this project), `project` (a shared `.mcp.json`), `user` (you, every project) |
| See what's connected | `/mcp` in a session |

## Hands-on: list a server's primitives

**1. Build the notes server.** Same on macOS, Linux and Windows:

```bash
cd labs/notes-mcp
npm install
npm run build
```

**2. List what it offers.**

```bash
npm run list
```

You should see: the output at the top of this chapter, with four tools, one resource and one prompt.

**3. Read it like a host.** Answer these from the output:

- Which items could Claude call on its own? (The tools.)
- Which one would you attach with `@`? (`notes://all`.)
- Which one would you run from the `/` menu? (`summarize_notes`.)

**4. Look at the raw messages (optional).**

```bash
npm run demo
```

You should see: every request and reply, including `"protocolVersion": "2025-11-25"` in the first reply and `"isError": true` at the very end.

Nothing is connected to Claude Code yet. That's the next step.

## Common mistakes

| Mistake | Reality |
|---|---|
| "Resources and prompts are tools" | Tools are for the model. Resources are attached by the app. Prompts are picked by you. |
| "MCP needs HTTP" | stdio is a standard transport, and most local servers use it. |
| "Every MCP session starts with `initialize`" | Only legacy versions do. `2026-07-28` is stateless. |

**Remember:**

- The host holds one client per server.
- Tools are model-controlled, resources app-controlled, prompts user-controlled.
- JSON-RPC messages are the same on every transport.
- Spec `2026-07-28` dropped the handshake. Claude Code still speaks both versions.

Test yourself with the [quiz](quiz.md): 5 questions.

## Sources

Checked against these pages on 2026-10-27. If they disagree with this chapter, trust them.

- MCP architecture: https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture
- Server concepts: https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts
- Client concepts: https://modelcontextprotocol.io/docs/2026-07-28/learn/client-concepts
- Elicitation: https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation
- Transports: https://modelcontextprotocol.io/specification/2026-07-28/basic/transports
- Changelog 2026-07-28: https://modelcontextprotocol.io/specification/2026-07-28/changelog
- Claude Code MCP: https://code.claude.com/docs/en/mcp
