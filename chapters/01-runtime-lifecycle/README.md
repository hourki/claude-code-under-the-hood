# 01 — Runtime lifecycle: one request, start to finish

**In short:** you'll follow one request from your prompt to the final answer.
Knowing who does each step tells you where to look when things go wrong.

**You'll learn:**

- who runs each step of the agent loop
- how an MCP tool call travels to a server and back
- why the model can't bypass your permission rules

## The loop

```
START (once)  Host loads CLAUDE.md, memory, settings
              Host connects MCP servers → tools/list
                         ↓
PROMPT        Your text → context
                         ↓
         ┌──▶ MODEL reasons ──── done? ──▶ FINAL ANSWER
         │         ↓ needs action
         │    MODEL requests tool {name, args}
         │         ↓
         │    HOST checks: hook → rules → mode → ask you
         │         ↓
         │    HOST runs it: built-in (Bash, Read)
         │                  or MCP: tools/call → server
         │         ↓
         └─── Result → context
```

## Who does each step

| # | Step | Who | What |
|---|---|---|---|
| 1 | Start | Host | Loads `CLAUDE.md`, memory and settings. Connects to each MCP server and asks for its tool list. |
| 2 | Prompt | Host | Adds your text to the context. |
| 3 | Reason | Model | Decides: answer, or ask for a tool. |
| 4 | Tool request | Model | Writes a tool name and its arguments. Nothing runs yet. |
| 5 | Checks | Host | Your `PreToolUse` hooks, then permission rules, then the permission mode, then a prompt to you if needed. |
| 6 | Run | Host | Runs a built-in tool, or sends the call to an MCP server, which runs it. |
| 7 | Result | Host | Adds the result, or the error, to the context. |
| 8 | Repeat | Model | Reasons again, back to step 3. |

Permission rules are allow, ask or deny patterns you write, and the permission mode is the fallback for calls no rule matches. Hooks, rules and modes are **enforced**: the host applies them whatever the model reasons. A denied call goes back to the model as an error, so it can try another way.

The context grows every turn, and every result costs tokens (the units the model counts text in). A result stays until the session ends or until compaction: near the limit, the host summarizes the conversation to free space. Files like `CLAUDE.md` are reloaded after that, but an instruction you only typed in chat can be lost.

## The tool list comes once

| Step | Between | When |
|---|---|---|
| Discovery: `tools/list` | Host ↔ server | Once, when the host connects. Again only if the server says its tools changed, or on a reconnect. |
| Exposure | Host → model | With tool search (on by default), the model first sees only MCP tool names. To use one, it calls `ToolSearch`, which loads that tool's schema (its input format). Built-in tools are always loaded. |
| Invocation: `tools/call` | Model → host → server | Every use. Only the result comes back. |

So the server doesn't resend its tool list on each call. Each use is one `tools/call` and one result.

## One call, two formats

The model writes this (Anthropic API format):

```json
{"type": "tool_use", "name": "mcp__github__list_commits", "input": {"repo": "payments"}}
```

The host's MCP client turns it into this JSON-RPC message for the server:

```json
{"jsonrpc": "2.0", "id": 7, "method": "tools/call",
 "params": {"name": "list_commits", "arguments": {"repo": "payments"}}}
```

The `mcp__<server>__` prefix is Claude Code's naming, and the server only knows `list_commits`. JSON-RPC is the letter, and the transport (stdio pipes or HTTP) is the postal service.

## Walkthrough: a service that won't start

Say you ask: *"the payments service won't start in staging, why?"*

```
1. Model → Read config.yaml              Host runs it
   result: env var "PAYMENTS_DB_URL"     → context

2. Model → mcp__github__list_commits     Host → tools/call → GitHub MCP server
   result: last commit renamed the var   → context

3. Model → Bash: npm start               Host checks controls, runs it
   result: "PAYMENTS_DB_URL is not set"  → context

4. Model → final answer:
   "The last commit renamed the variable. The config still
    reads PAYMENTS_DB_URL. Update the config or restore the name."
```

After each result, the model reasons again. That's the loop.

## How Claude picks a tool

Claude matches your prompt to tool names and descriptions. There's no routing table, so it may pick Bash `gh` (the GitHub CLI) instead of the GitHub MCP tools. To steer it:

| Lever | Strength |
|---|---|
| Clear tool descriptions | Advisory: a hint the model can ignore |
| A line in your prompt or `CLAUDE.md`: "use the GitHub MCP tools" | Advisory |
| A deny rule on `Bash(gh *)` | Enforced: the host blocks it |

## Common mistakes

| Mistake | Reality |
|---|---|
| `tools/list` runs before each call | Only at connect, or when the server's tools change. |
| The host runs MCP tools | The host passes the call on. The MCP server runs it. |
| Reading a file adds no tokens | Every tool result enters the context. |
| A hook and a permission prompt are the same | A hook is your code. A prompt is the host asking you. |

**Remember:**

- The model asks. The host checks, runs and routes.
- The tool list comes once. Each use is one `tools/call`.
- Every tool result costs context.
- MCP tools run in their server, not in the host.
- Enforced rules hold, whatever the model reasons.

Test yourself with the [quiz](quiz.md): 10 open questions and a 5-question retest.

## Sources

Checked against these pages on 2026-10-26. If they disagree with this chapter, trust them.

- Claude Code overview: https://code.claude.com/docs/en/overview
- Claude Code MCP (tool search): https://code.claude.com/docs/en/mcp
- Permissions: https://code.claude.com/docs/en/permissions
- Hooks: https://code.claude.com/docs/en/hooks
- MCP tools: https://modelcontextprotocol.io/specification/2026-07-28/server/tools
