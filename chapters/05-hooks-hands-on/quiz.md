# 05 — Quiz: hooks

Answer each question first, then open **Answer** to check it.

**1.** Your `PreToolUse` hook spots `rm -rf` and exits with code 1. What happens to the call?

- a) it's blocked
- b) it goes ahead: exit 1 is a non-blocking error
- c) you get a permission prompt
- d) Claude Code stops the session

<details markdown="1"><summary>Answer</summary>

**b** — by default, only exit code 2 (or a JSON deny) blocks. Exit 1 shows an error notice and the call runs.

</details>

**2.** Your hook prints `{"permissionDecision": "deny"}` at the top level of its JSON, then exits 0. What happens?

- a) the call is blocked
- b) the field is ignored, so the normal permission flow continues
- c) Claude Code shows a settings error
- d) the hook is disabled

<details markdown="1"><summary>Answer</summary>

**b** — `permissionDecision` belongs inside `hookSpecificOutput`. Fields at the wrong level are silently ignored.

</details>

**3.** A session runs in `bypassPermissions`. Your `PreToolUse` hook denies a command. Does it run?

- a) yes: bypass skips every check
- b) no: the hook runs before any permission-mode check, so its deny holds
- c) only if an allow rule matches
- d) you get a prompt instead

<details markdown="1"><summary>Answer</summary>

**b** — a hook deny blocks even in `bypassPermissions` and with `--dangerously-skip-permissions`.

</details>

**4.** You want a log line for every successful tool call, without slowing Claude down. Which setup fits?

- a) a `PreToolUse` hook that exits 2
- b) a `PostToolUse` hook with `"async": true`
- c) a deny rule
- d) a line in `CLAUDE.md`

<details markdown="1"><summary>Answer</summary>

**b** — `PostToolUse` runs after a tool succeeds, and `async` runs it in the background. It observes, it can't block.

</details>

**5.** You add a hook with matcher `mcp__notes` to guard every tool of an MCP server named `notes`. It never fires. Why?

- a) hooks can't match MCP tools
- b) the server must be restarted
- c) a bare server name matches nothing: use `mcp__notes__.*`
- d) MCP tools skip `PreToolUse`

<details markdown="1"><summary>Answer</summary>

**c** — MCP tools are named `mcp__<server>__<tool>`. Matching a whole server needs the `.*` part.

</details>
