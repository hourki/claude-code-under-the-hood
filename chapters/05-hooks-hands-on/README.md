# 05 — Hooks: block or observe

**In short:** a hook is your own script that Claude Code runs at set moments, like right before a tool call.
It's the most flexible enforced control you can write yourself.

**You'll learn:**

- which moments a hook can attach to, and which ones can block
- how a hook reads a tool call and denies it
- the exit-code trap that silently lets calls through

## A hook at work

```bash
echo '{"tool_name":"Bash","tool_input":{"command":"rm -rf build"}}' | node dist/block-dangerous.js
```

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Blocked: rm with -r and -f deletes without asking. Delete specific files, or ask the user first."}}
```

Claude Code sends the tool call to the hook as JSON on stdin, and the hook answers with JSON on stdout. Here it says "deny", so Claude Code blocks the call and shows the reason to Claude. That's the whole contract.

The script is in [`labs/hooks`](https://github.com/hourki/claude-code-under-the-hood/tree/main/labs/hooks), written in TypeScript and run with `node`.

## When hooks run

An event is a moment in the session that a hook can attach to. There are more than 30, and these are the ones you'll use first:

| Event | Fires | Can it block? |
|---|---|---|
| `SessionStart` | A session starts or resumes | No. Its output is added as context. |
| `UserPromptSubmit` | You send a prompt, before Claude sees it | Yes |
| `PreToolUse` | Before a tool call runs | Yes: exit code 2, or a JSON deny |
| `PermissionRequest` | Claude Code is about to ask you for permission | It can answer the prompt for you |
| `PostToolUse` | After a tool call succeeds | No: the tool already ran |
| `Stop` | Claude finishes its answer | Yes: it can keep Claude working |
| `SessionEnd` | The session ends | No |

## Block or observe

A **blocking** hook stops something before it happens, and `PreToolUse` is the main one. It runs before any permission-mode check, so its deny holds even in `bypassPermissions`.

An **observing** hook only watches. `PostToolUse` runs after a tool succeeds, so it can log or add context, but it can't undo anything. Add `"async": true` and it runs in the background without slowing Claude down.

## How a hook decides: exit codes

| Exit code | What happens |
|---|---|
| `0` | Success. JSON on stdout is applied. No JSON means no decision, so the normal permission flow runs. |
| `2` | Block. stderr is the reason, and Claude sees it. |
| Anything else, like `1`, with no valid JSON | A non-blocking error. **The call goes ahead**, with an error notice in the transcript. |

Exit code 1 is the trap: it's the usual Unix "failure" code, yet it doesn't block. A crashed hook, a typo in its path or a timeout doesn't block either. Add `"onFailure": "block"` to a hook (v2.1.295 and later) to turn any failure into a block.

Pick one style per hook: exit codes alone, or exit 0 plus JSON. The JSON deny goes inside `hookSpecificOutput`, and a `permissionDecision` at the top level is silently ignored.

## Register a hook

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "node", "args": ["<path>/labs/hooks/dist/block-dangerous.js"] }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [{ "type": "command", "command": "node", "args": ["<path>/labs/hooks/dist/log-tool-use.js"], "async": true }]
      }
    ]
  }
}
```

This goes in a settings file. The shape is event → matcher groups → handlers.

- **`matcher`** picks the tools: `Bash`, `Edit|Write`, or `*` for all. It's case-sensitive. For an MCP server named `notes`, `mcp__notes__.*` matches all its tools, and a bare `mcp__notes` matches nothing.
- **`command` + `args`** runs the program directly, with no shell, so the same entry works on Windows.
- **Trust:** hooks from a project's settings wait until you accept the folder trust prompt.
- **`/hooks`** shows every configured hook and where it comes from. It's read-only.

A hook's "allow" can't get past a deny or ask rule: hooks tighten, they don't loosen. With several `PreToolUse` hooks, the strictest answer wins.

## Hands-on: block `rm -rf`, log everything else

You'll use a throwaway practice folder. Your own settings don't change.

**1. Build and test the hooks.**

```bash
cd labs/hooks
npm install
npm run build
npm test
```

You should see: `ℹ pass 3` and `ℹ fail 0`.

**2. Feed the hook sample calls.** No Claude session needed.

macOS / Linux:

```bash
node dist/block-dangerous.js < samples/rm-rf.json
node dist/block-dangerous.js < samples/safe.json
```

Windows (PowerShell):

```powershell
Get-Content samples\rm-rf.json | node dist\block-dangerous.js
Get-Content samples\safe.json | node dist\block-dangerous.js
```

You should see: the deny JSON for `rm-rf.json`, and nothing at all for `safe.json`. Silence means "no decision".

**3. Make a practice folder with the hooks in it.** Still inside `labs/hooks`:

macOS / Linux:

```bash
mkdir -p ~/hooks-practice/.claude
npm run --silent print-settings > ~/hooks-practice/.claude/settings.json
```

Windows (PowerShell):

```powershell
mkdir $HOME\hooks-practice\.claude
npm run --silent print-settings | Set-Content $HOME\hooks-practice\.claude\settings.json
```

`print-settings` prints the JSON above with your real paths filled in.

**4. Start Claude Code there.** `cd ~/hooks-practice` (PowerShell: `cd $HOME\hooks-practice`), run `claude`, and accept the trust prompt. Then run `/hooks`.

You should see: a `PreToolUse` hook for `Bash` and a `PostToolUse` hook for `*`, both from project settings.

**5. Try the blocked command.** Ask: *"Run rm -rf build."*

You should see: Claude reports that the command was blocked and quotes the hook's reason.

**6. Try a harmless command.** Ask: *"Run echo hello."* Approve it if asked.

You should see: it runs, and `labs/hooks/tool-log.txt` gets a new line for it.

**7. See the exit-code trap (optional).** In `.claude/settings.json`, change `block-dangerous.js` to `block-dangerous-typo.js`, then ask *"Run echo hi."*

You should see: the command still runs, and the transcript (`Ctrl+O`) shows a hook error. Now add `"onFailure": "block"` next to `"type": "command"` in that entry and ask again. This time the call is blocked.

**8. Clean up.** Exit Claude Code, delete `~/hooks-practice`, and delete `labs/hooks/tool-log.txt`.

## Why credentials are still stronger

The hook matches words, so it misses `bash -c "rm -rf x"`, aliases and variables. The code says so in a `shortcut:` comment. A credential that can't delete anything holds no matter how the command is spelled, so use hooks to catch mistakes and credentials to rule out the worst case.

## Common mistakes

| Mistake | Reality |
|---|---|
| Exit 1 to block | Exit 1 doesn't block by default. Use exit 2 or a JSON deny. |
| Matcher `bash` | Matchers are case-sensitive. The tool is `Bash`. |
| Expecting `PostToolUse` to undo a call | It runs after the tool. Use `PreToolUse` to stop things. |
| "My project hook doesn't fire" | Project hooks wait for the folder trust prompt. |

**Remember:**

- A hook reads JSON on stdin and answers on stdout.
- `PreToolUse` blocks. `PostToolUse` only observes.
- Exit 2 or a JSON deny blocks. Exit 1 lets the call through, unless `onFailure` is `block`.
- A hook deny holds even in bypass mode, but a hook allow can't beat a deny rule.

Test yourself with the [quiz](quiz.md): 5 questions.

## Sources

- Hooks reference: https://code.claude.com/docs/en/hooks
- Hooks guide: https://code.claude.com/docs/en/hooks-guide
- Precedence among rules and hooks: https://code.claude.com/docs/en/permissions#precedence-among-rules-hooks-and-mods
