# 13 — Build your own harness

**In short:** you'll write a small TypeScript host that runs the agent loop with one tool you wrote.
The "harness" around the model is just code, and this time it's yours.

**You'll learn:**

- how `query()` streams the agent loop as messages you can print
- how to give the model one custom tool and nothing else
- which Agent SDK option matches which Claude Code feature

## Your harness, first

```typescript
const inventory = createSdkMcpServer({ name: "inventory", version: "1.0.0", tools: [lookup], alwaysLoad: true });
...
const options = {
  mcpServers: { inventory },
  tools: [], // no built-in tools: no Bash, Read, Write or Edit
  allowedTools: ["mcp__inventory__lookup_service"], // pre-approve our one tool
  permissionMode: "dontAsk" as const, // anything not pre-approved is denied, never prompted
  settingSources: [], // ignore CLAUDE.md and settings files on disk
  maxTurns: 5,
};
...
for await (const message of query({ prompt, options })) {
  console.log(describe(message));
}
```

A run prints lines in this shape. This is a shortened example, and Claude's wording differs on every run:

```text
[system/init] model=<model> tools=mcp__inventory__lookup_service mode=dontAsk
[assistant] tool_use mcp__inventory__lookup_service {"name":"payments"}
[user] tool_result [{"type":"text","text":"{\"name\":\"payments\",\"status\":\"degraded\",...}"}]
[assistant] text: The payments service is degraded. It runs version 2.4.1, ...
[result/success] turns=2 denials=0
```

That's the loop from [Chapter 01](../01-runtime-lifecycle/README.md), printed one message at a time. The code is in [`labs/mini-harness`](https://github.com/hourki/claude-code-under-the-hood/tree/main/labs/mini-harness).

## Host and model, again

In [Chapter 01](../01-runtime-lifecycle/README.md), the model asks and the host checks, runs and routes. The **Claude Agent SDK** is a library that runs the Claude Code binary for you, so Claude Code's host does the same jobs inside your program. Your script sits around it and decides the options.

| Who | Does what in this lab |
|---|---|
| Model | Reads the prompt and the tool list, asks for `lookup_service`, writes the answer |
| SDK (Claude Code inside) | Runs the loop, checks permissions, calls your tool, adds the result to the context |
| Your script | Picks the tools and rules, defines the tool, prints each message |

The SDK bundles the Claude Code binary as an optional npm dependency, so you don't install Claude Code separately. As of October 2026 the lab uses SDK 0.3.312, and the SDK version tracks the bundled Claude Code version ([TypeScript reference](https://code.claude.com/docs/en/agent-sdk/typescript#installation)).

## The message stream

`query()` returns an async generator: each `for await` step hands you the next message. Five types drive the loop:

| `type` (`subtype`) | When it arrives | Fields the lab prints |
|---|---|---|
| `system` (`init`) | Once, at the start | `model`, `tools`, `permissionMode` |
| `assistant` | For each content block Claude writes: text or a `tool_use` | `message.content` |
| `user` | After each tool runs, carrying the `tool_result` sent back to Claude | `message.content` |
| `stream_event` | Only when you turn on partial messages | Not used here |
| `result` (`success`, `error_max_turns`, ...) | Once, when the loop ends | `num_turns`, `permission_denials`, `result` |

One **turn** is one round trip: Claude asks for tools, the SDK runs them, and the results go back. `maxTurns` caps them, and the final text-only reply counts as a turn too. Other messages, like rate-limit status, can appear in between, so loop to the end instead of stopping at `result`.

## One custom tool

```typescript
const lookup = tool(
  "lookup_service",
  "Look up one service in the local inventory: its status, version and notes.",
  { name: z.string().describe("The service name, like payments") },
  async ({ name }) => {
    const service = lookupService(name);
    if (!service) {
      return { content: [{ type: "text", text: `No service named ${name}` }], isError: true };
    }
    return { content: [{ type: "text", text: JSON.stringify(service) }] };
  },
  { annotations: { readOnlyHint: true } }
);
```

A tool has four parts: a name, a description Claude reads to pick it, an input schema (a Zod schema in TypeScript), and a handler that returns `content`. `isError: true` tells Claude the call failed, so it can react.

`createSdkMcpServer()` wraps the tool in an MCP server that runs inside your process, with no separate server process. Its full name follows the pattern from [Chapter 08](../08-mcp-fundamentals/README.md): `mcp__<key in mcpServers>__<tool name>`, here `mcp__inventory__lookup_service`.

The tool takes a service name, never a file path, so the model can't point it at another file. `readOnlyHint` is only a hint: it lets Claude batch the call with other read-only calls, but it enforces nothing. The handler is what keeps the tool read-only.

## Lock it down

| Option | Layer | What it does here |
|---|---|---|
| `tools: []` | Availability | Removes every built-in tool from Claude's context. MCP tools stay. |
| `allowedTools` | Permission | Pre-approves the listed tools. It **doesn't** hide the others. |
| `disallowedTools` | Both | A bare name removes the tool. A scoped rule like `Bash(rm *)` denies matching calls. |
| `permissionMode: "dontAsk"` | Permission | Denies any call that would need approval, instead of asking |
| `canUseTool` | Permission | Your callback, called only when nothing earlier decided. Not used here. |

The SDK checks every tool call in this order:

```
 tool request
      │
 ① hooks ─────────────── deny ──▶ BLOCKED
 ② deny rules ────────── match ─▶ BLOCKED (even in bypassPermissions)
 ③ ask rules ─────────── match ─▶ canUseTool
 ④ permission mode ───── bypass / acceptEdits may approve
 ⑤ allow rules ───────── match ─▶ RUN
 ⑥ canUseTool ────────── your callback decides
                         (in dontAsk: skipped, the call is denied)
```

Two traps. `allowedTools` with `bypassPermissions` approves **every** tool, because unlisted tools fall through to the mode. And an allow rule like `mcp__*` is ignored: allow globs need a literal server name, like `mcp__inventory__*`.

## What the SDK loads by default

If you leave `settingSources` out, `query()` reads the same files as the Claude Code CLI: user, project and local settings, `CLAUDE.md` files, `.mcp.json`, and the skills, agents, commands and hooks in `.claude/`. So a plain script picks up your own allow rules and hooks. `settingSources: []` turns those off, which is why the lab sets it. Managed policy settings still load either way.

The default system prompt is also different: without a `systemPrompt` option you get a minimal prompt, not Claude Code's. Pass `{ type: "preset", preset: "claude_code" }` to get Claude Code's.

## Claude Code and the SDK, side by side

| In Claude Code | In the SDK | Chapter |
|---|---|---|
| Allow and deny rules in `settings.json` | `allowedTools` and `disallowedTools`, added to the same rule lists | [04](../04-permissions/README.md) |
| Permission modes | `permissionMode`: `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions` | [04](../04-permissions/README.md#permission-modes) |
| The permission prompt you answer | The `canUseTool` callback | [04](../04-permissions/README.md) |
| Hooks in `settings.json` | `hooks`: callbacks for events like `PreToolUse`, with the same `hookSpecificOutput` deny | [05](../05-hooks-hands-on/README.md) |
| Subagent files in `.claude/agents/` | `agents`: subagent definitions in code, run through the `Agent` tool | [07](../07-subagents/README.md) |
| MCP servers in `.mcp.json` | `mcpServers`, including in-process servers from `createSdkMcpServer()` | [08](../08-mcp-fundamentals/README.md) |

With the default `settingSources`, the file-based versions in the left column load too.

## Hands-on: run your harness

You need Node.js and an API key from the [Claude Console](https://platform.claude.com/). The SDK also works through cloud providers such as Amazon Bedrock (`CLAUDE_CODE_USE_BEDROCK=1`). The SDK quickstart lists them.

**1. Build and test the tool.** No API call.

```bash
cd labs/mini-harness
npm install
npm run build
npm test
```

You should see: `ℹ pass 2` and `ℹ fail 0`.

**2. Set your API key** in the shell you'll run the harness from. The SDK reads it from the environment and doesn't load `.env` files.

macOS / Linux:

```bash
export ANTHROPIC_API_KEY=<your-api-key>
```

Windows (PowerShell):

```powershell
$env:ANTHROPIC_API_KEY = "<your-api-key>"
```

You should see: no output.

**3. Run the harness.** This calls the API and is billed to your account.

```bash
npm start
```

You should see: `[system/init]` with only `mcp__inventory__lookup_service` in `tools`, then a `tool_use`, a `tool_result`, a text answer saying payments is degraded, and `[result/success]`.

**4. Ask for a write.**

```bash
npm start -- "Copy the inventory into a new file named copy.json"
```

You should see: no `tool_use` for any file tool, because none exists, and a text-only reply. No `copy.json` appears in the folder.

**5. Watch a deny win (optional).** In `src/main.ts`, add `disallowedTools: ["mcp__inventory__lookup_service"],` to `options`, then run `npm run build` and `npm start`.

You should see: no `tool_result` with data, and Claude saying it couldn't look the service up. A deny beats the allow rule for the same tool. Remove the line and rebuild when you're done.

## Common mistakes

| Mistake | Reality |
|---|---|
| `allowedTools` limits Claude to those tools | It only pre-approves them. Use `tools` or `disallowedTools` to remove tools. |
| `allowedTools` makes `bypassPermissions` safe | Bypass approves every unlisted tool. Block tools with `disallowedTools`. |
| An SDK script ignores my `CLAUDE.md` and settings | By default it loads user, project and local settings, like the CLI. Pass `settingSources: []`. |
| `readOnlyHint: true` makes a tool read-only | It's a hint. Only the handler's code decides what the tool does. |
| `allowedTools: ["mcp__*"]` approves all MCP tools | It's ignored. Name the server: `mcp__inventory__*`. |

**Remember:**

- The SDK runs Claude Code's host inside your program, and your script sets its options.
- `query()` streams the loop: `system/init`, `assistant`, `user`, then `result`.
- `tools` decides what Claude can see. `allowedTools` only decides what runs without asking.
- Leave out `settingSources` and your `CLAUDE.md`, settings and hooks come along.

Test yourself with the [quiz](quiz.md): 9 questions.

## Sources

- Agent SDK overview: https://code.claude.com/docs/en/agent-sdk/overview
- Agent SDK quickstart (API key, install): https://code.claude.com/docs/en/agent-sdk/quickstart
- How the agent loop works (turns, message types): https://code.claude.com/docs/en/agent-sdk/agent-loop
- TypeScript reference (`query()`, `tool()`, `createSdkMcpServer()`, `Options`, message types): https://code.claude.com/docs/en/agent-sdk/typescript
- Custom tools: https://code.claude.com/docs/en/agent-sdk/custom-tools
- Configure permissions: https://code.claude.com/docs/en/agent-sdk/permissions
- MCP in the SDK (tool naming): https://code.claude.com/docs/en/agent-sdk/mcp#tool-naming-convention
- Hooks in the SDK: https://code.claude.com/docs/en/agent-sdk/hooks
- Subagents in the SDK: https://code.claude.com/docs/en/agent-sdk/subagents
- Use Claude Code features (`settingSources`): https://code.claude.com/docs/en/agent-sdk/claude-code-features
