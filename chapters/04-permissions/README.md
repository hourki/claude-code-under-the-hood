# 04 — Permissions: modes and rules

**In short:** permission rules and modes decide what Claude Code may do without asking you.
Set them well, and you get fewer prompts and fewer surprises.

**You'll learn:**

- how allow, ask and deny rules combine
- what each permission mode lets through
- where pattern rules fail

## A rule file, first

```json
{
  "permissions": {
    "allow": ["Bash(npm run *)"],
    "ask": ["Bash(git push *)"],
    "deny": ["Read(./.env)"],
    "defaultMode": "acceptEdits"
  }
}
```

This goes in a settings file, like the ones in [Chapter 02](../02-settings-and-defaults/README.md). Each entry is a rule: a tool name, often with a pattern in parentheses.

- `allow` runs a matching call without asking.
- `ask` always shows you a prompt, even in modes that would approve it.
- `deny` blocks the call. For `Read` rules, it also hides matching files from search.
- `defaultMode` picks the mode the session starts in.

Edits to `permissions` apply to a running session. You don't need to restart.

## How rules combine

Claude Code checks deny, then ask, then allow, and the first match wins. How specific a rule is doesn't matter, so `Bash(aws *)` in deny beats `Bash(aws s3 ls)` in allow.

Rules from all your settings files merge, and a deny in one file can't be undone by an allow in another. An allow in your local file also doesn't outrank an ask from the project or managed file.

If no rule matches, the mode decides. Claude Code enforces all of this, not the model, so writing "you may push" in `CLAUDE.md` changes nothing.

## Rule syntax at a glance

| Tool | Rule | What it matches |
|---|---|---|
| Bash | `Bash(git log *)` | Only `git log` commands |
| Bash | `Bash(git *)` | Every git command |
| Bash | `Bash(ls *)` vs `Bash(ls*)` | The first matches `ls -la` but not `lsof`. The second matches both. |
| Bash | `Bash(ls:*)` | Same as `Bash(ls *)`. `:*` works only at the end. |
| Read / Edit | `Read(./.env)` | `.env` at any depth under the current folder |
| Read / Edit | `Read(//etc/hosts)`, `Read(~/notes.txt)` | `//` starts an absolute path, `~/` is your home |
| WebFetch | `WebFetch(domain:example.com)` | That host only |
| MCP | `mcp__github`, `mcp__github__list_commits` | The whole server, or one tool |
| Subagent | `Agent(Explore)` | The built-in Explore subagent |

Three details trip people up:

- **Compound commands.** For `a && b`, each part must match an allow rule. A deny or ask rule fires if any part matches, even inside `$(...)`.
- **Wrappers.** Claude Code strips `timeout`, `time`, `nice`, `nohup` and a few others before matching. It doesn't strip `npx` or `docker exec`.
- **Path rules.** Only `Read(...)` and `Edit(...)` path rules match. A `Write(path)` rule is accepted but never matches anything.

## Permission modes

A mode is the session-wide fallback for calls no rule decides.

| Mode | Runs without asking |
|---|---|
| `default` (shown as "Manual") | Reads only |
| `acceptEdits` | Reads, file edits, and common file commands like `mkdir`, `mv`, `cp` in your working folders |
| `plan` | Reads, plus commands auto mode's safety check approves when auto mode is available. Claude writes a plan but doesn't edit your files. |
| `auto` | Everything, with background safety checks |
| `dontAsk` | Reads plus pre-approved tools. Anything that would prompt is denied. |
| `bypassPermissions` | Everything. For isolated containers and VMs only. |

**Starting mode:** the `--permission-mode` flag wins, then `defaultMode`, then the built-in default from [Chapter 02](../02-settings-and-defaults/README.md#whats-on-by-default). Press `Shift+Tab` to switch modes in a session. `dontAsk` isn't in that cycle, so start it with `--permission-mode dontAsk`.

**Auto mode** sends each action your rules don't settle, other than reads and edits in your working folder, to a separate classifier model. It blocks actions that go beyond your request, touch infrastructure it doesn't recognize, or come from hostile content. Your ask rules still prompt, and the docs say plainly that it "does not guarantee safety".

**Bypass mode** still obeys deny rules, and ask rules still prompt. Setting `auto` or `bypassPermissions` as `defaultMode` works only from your user or managed settings. A project or local file can't do it.

## Where pattern rules fail

The docs say it directly: a Bash rule isn't a security boundary.

- `Bash(rm *)` doesn't stop `/bin/rm …` or `bash -c 'rm …'`.
- `Bash(git push *)` doesn't stop `git -C . push`.
- `Bash(curl http://github.com/ *)` misses `https://`, extra flags and variables.
- A `Read` deny doesn't stop `grep -r` or a script that opens the file itself.
- Allowing only `WebFetch` leaves the network open if Bash can run `curl`.

When a rule must hold, back it with the sandbox, which limits what a command can reach however it's spelled, or with a hook that checks the full command with your own logic.

## Hands-on: watch a deny rule work

You'll create a throwaway folder, block one file, and watch the block happen. Nothing outside the folder changes.

**1. Make the folder and a fake secret.**

macOS / Linux:

```bash
mkdir perm-lab && cd perm-lab
echo "API_KEY=fake" > .env
mkdir .claude
```

Windows (PowerShell):

```powershell
mkdir perm-lab; cd perm-lab
Set-Content .env "API_KEY=fake"
mkdir .claude
```

**2. Add the rule.** Create `.claude/settings.json` in that folder:

```json
{
  "permissions": {
    "deny": ["Read(./.env)"]
  }
}
```

**3. Start Claude Code in Manual mode**, so Bash commands that aren't read-only ask first. Accept the folder trust prompt if you see one.

```bash
claude --permission-mode default
```

**4. Check the rule loaded.** Run `/permissions`.

You should see: your `Read(./.env)` deny rule, with `.claude/settings.json` as its source.

**5. Try to read the file.** Ask: *"Read .env and tell me what's in it."*

You should see: the read is blocked, and Claude says it can't read that file. If it tries `cat .env` instead, that's blocked too, because `Read` rules also cover file commands Claude Code recognizes in Bash. A `grep -r` or a script that opens the file itself would still get through: that's the gap from above.

**6. Remove the rule.** Change the file to `{"permissions": {"deny": []}}`, save, and ask again.

You should see: Claude reads the file this time, with no restart.

**7. Clean up.** Exit Claude Code, then delete the folder: `cd .. && rm -rf perm-lab` (PowerShell: `cd ..; Remove-Item -Recurse -Force perm-lab`).

**Remember:**

- Deny, then ask, then allow. The first match wins.
- A deny in any settings file beats an allow in another.
- The mode only decides what no rule covers.
- Pattern rules match text, so they're not a security boundary.
- `/permissions` shows every rule and the file it came from.

Test yourself with the [quiz](quiz.md): 5 questions.

## Sources

- Permissions: https://code.claude.com/docs/en/permissions
- Permission modes: https://code.claude.com/docs/en/permission-modes
- Settings reference (`permissions` keys): https://code.claude.com/docs/en/settings-reference#permissions
