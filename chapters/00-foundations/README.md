# 00 — Foundations: the mental model

**In short:** an AI coding agent is a handful of parts, and each part has one job.
Learn them here, and every later chapter is easier to follow.

**You'll learn:**

- the parts of an agent, in one line each
- where each part runs
- which part actually runs your commands

## Where each part runs

```
 Anthropic servers              Your machine (or a cloud VM)
┌──────────────────┐          ┌─────────────────────────────────────┐
│                  │  prompt  │  HOST (Claude Code)                 │
│   MODEL (LLM)    │◀─────────│   • agent loop                      │
│                  │  + tools │   • built-in tools: Read, Bash, ... │
│ reasons, writes  │          │   • hooks, permission rules, modes  │
│ tool requests    │─────────▶│   • MCP client                      │
│                  │ tool_use │        │                │           │
└──────────────────┘          └────────┼────────────────┼───────────┘
                                       │ stdio          │ HTTP
                                       ▼                ▼
                              ┌────────────────┐  ┌───────────────────┐
                              │ MCP server     │  │ MCP server        │
                              │ local process  │  │ remote service    │
                              │ (started by    │  │ (vendor URL or    │
                              │  the host)     │  │  your server)     │
                              └────────────────┘  └───────────────────┘
```

The model only sends text back: an answer, or a request to use a tool. The host runs the tools, checks your controls and talks to MCP servers. An MCP server runs its own tools, and the host only passes the call along.

## The parts

| Part | Role |
|---|---|
| Model (LLM, large language model) | Reads text and writes text: answers and tool requests. It never runs anything itself. |
| Host (here, Claude Code) | The app around the model. It runs the agent loop and the tools, enforces your controls, and talks to MCP servers. It's software: it runs on your laptop, in your IDE or on a cloud VM. |
| Tool | One action: read a file, run a command, call an API. Claude Code has built-in tools like `Read` and `Bash`. |
| MCP | Model Context Protocol: a standard way for a host to find and call tools in another program. Its messages use JSON-RPC 2.0, a simple request-and-reply format in JSON. |
| MCP server | A program that offers tools and runs them. Either a local process that talks over stdio (its standard input and output) or a remote service over HTTP. |
| Plugin | A package of extensions: skills, hooks, subagents, MCP servers. It doesn't need MCP. |
| Skill | Saved instructions or a workflow that the model reads when it needs them. |
| Hook | Your own script that the host runs at set moments, like `PreToolUse` (right before a tool runs). |
| Permission system | Rules and modes that decide whether a tool call is allowed, needs your OK, or is denied. |
| Subagent | A helper AI with its own fresh context window. |
| Context | Everything the model sees right now. It has a fixed size. |
| Memory | Files, like `CLAUDE.md`, that the host loads into context in later sessions. |

## Common mistakes

| Mistake | Reality |
|---|---|
| "The host is my laptop." | The host is the application, Claude Code. It can run on a laptop or a cloud VM. |
| "Tools need MCP." | Built-in tools like `Read` and `Bash` aren't MCP. MCP is one way to add more tools. |
| "A skill is a tool." | A skill is instructions. The model reads it, then uses tools. |
| "Memory trains the model." | Memory is files loaded into context. The model never changes. |

**Remember:**

- The model decides. The host does the work.
- MCP is one way to add tools, not the only one.
- Skills are instructions. Hooks are your code.
- Memory is files, not training.

Test yourself with the [quiz](quiz.md): 3 questions.

## Sources

Checked against these pages on 2026-10-26. If they disagree with this chapter, trust them.

- Claude Code overview: https://code.claude.com/docs/en/overview
- Features overview (skills, hooks, subagents, plugins, MCP): https://code.claude.com/docs/en/features-overview
- MCP specification 2026-07-28: https://modelcontextprotocol.io/specification/2026-07-28
