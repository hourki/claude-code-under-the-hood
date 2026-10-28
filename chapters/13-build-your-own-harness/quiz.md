# 13 — Quiz: build your own harness

Pick an answer. The quiz checks it and shows the explanation.

<quiz>
**1.** Your SDK script runs a query. Which component actually runs your `lookup_service` handler when Claude asks for it?

- [ ] a) the model, on Anthropic's servers
- [x] b) the SDK, inside your process, through the in-process MCP server
- [ ] c) a separate MCP server process that the SDK starts
- [ ] d) your shell, as a Bash command

**b** — the model only asks for the tool. `createSdkMcpServer()` runs the server inside your application, and the SDK calls the handler there.
</quiz>

<quiz>
**2.** You print every message from `query()`. Which order shows one tool call and a final answer?

- [ ] a) `result`, `assistant`, `user`, `system/init`
- [ ] b) `assistant`, `system/init`, `result`, `user`
- [ ] c) `system/init`, `user` with `tool_use`, `assistant` with `tool_result`, `result`
- [x] d) `system/init`, `assistant` with `tool_use`, `user` with `tool_result`, `assistant` with text, `result`

**d** — the init message comes first. Claude's tool request arrives as an `assistant` message, the tool's output goes back as a `user` message, and `result` ends the loop.
</quiz>

<quiz>
**3.** You register a server as `mcpServers: { inventory: server }` with a tool named `lookup_service`. What do you put in `allowedTools`?

- [ ] a) `lookup_service`
- [ ] b) `inventory.lookup_service`
- [x] c) `mcp__inventory__lookup_service`
- [ ] d) `mcp__*`

**c** — MCP tools are named `mcp__<key in mcpServers>__<tool name>`. An unanchored `mcp__*` allow rule is ignored.
</quiz>

<quiz>
**4.** A teammate sets `allowedTools: ["Read"]` and `permissionMode: "bypassPermissions"`, and expects Claude to only read. What happens when Claude calls `Bash`?

- [x] a) it runs: unlisted tools fall through to the mode, and bypass approves them
- [ ] b) it's denied, because `Bash` isn't in `allowedTools`
- [ ] c) `canUseTool` is asked
- [ ] d) the SDK refuses to start with this combination

**a** — `allowedTools` pre-approves the tools it lists. It doesn't restrict the others. To block a tool, use `disallowedTools` or leave it out of `tools`.
</quiz>

<quiz>
**5.** You want Claude to see no built-in tools at all, only your MCP tool. Which option does that?

- [ ] a) `allowedTools: ["mcp__inventory__lookup_service"]`
- [ ] b) `permissionMode: "plan"`
- [ ] c) `settingSources: []`
- [x] d) `tools: []`

**d** — `tools: []` removes every built-in from Claude's context, and MCP tools stay. `allowedTools` only decides what runs without asking.
</quiz>

<quiz>
**6.** Your harness has no `settingSources` option. Your project has a `CLAUDE.md` and a `.claude/settings.json` with hooks. What does the SDK load?

- [ ] a) nothing from disk: the SDK only uses what you pass in code
- [ ] b) only `CLAUDE.md`
- [x] c) both, plus user and local settings, like the Claude Code CLI
- [ ] d) only managed policy settings

**c** — when `settingSources` is left out, `query()` reads user, project and local settings, `CLAUDE.md` files and `.claude/` content. Pass `settingSources: []` to turn that off.
</quiz>

<quiz>
**7.** Your tool deletes old log files, and you mark it `readOnlyHint: true`. What does the hint change?

- [ ] a) the SDK blocks any write the handler tries
- [x] b) nothing about what the handler does: it's metadata, not enforcement
- [ ] c) the tool can only be called in `plan` mode
- [ ] d) the tool needs no entry in `allowedTools`

**b** — annotations describe the tool. They let Claude batch read-only calls, but the handler's code decides what it really does, so keep the hint accurate.
</quiz>

<quiz>
**8.** In `dontAsk` mode, Claude calls a tool that no allow rule covers and that needs approval. What happens?

- [ ] a) your `canUseTool` callback decides
- [ ] b) it runs, because `dontAsk` never prompts
- [ ] c) the session stops with an error
- [x] d) the call is denied, without calling `canUseTool`

**d** — `dontAsk` turns every call that would prompt into a deny, and the `canUseTool` step is skipped.
</quiz>

<quiz>
**9.** You list `mcp__inventory__lookup_service` in both `allowedTools` and `disallowedTools`. What happens when Claude tries the tool?

- [ ] a) it runs, because allow rules are checked first
- [x] b) it's denied: deny rules are checked before allow rules
- [ ] c) `canUseTool` decides
- [ ] d) the last option you wrote wins

**b** — the SDK checks hooks, then deny rules, then ask rules, the mode, and allow rules last. A deny that matches ends it, the same rule as in Chapter 04.
</quiz>

<!-- mkdocs-quiz results -->
