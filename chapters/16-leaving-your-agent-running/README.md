# 16 — Leaving your agent running safely

**In short:** when you step away, nobody answers permission prompts, so other layers must hold.
Deny rules set hard limits, auto mode screens the rest, and your phone calls you back.

**You'll learn:**

- what auto mode blocks while you're away, and where it can miss
- when to use a deny rule and when to use `autoMode.hard_deny`
- how to get prompts and alerts on your phone with Remote Control

## You walk away, Claude keeps going

You ask Claude to "clean up old branches" and go to lunch. As of October 2026 (v2.1.283 or later), a terminal session [starts in auto mode](https://code.claude.com/docs/en/permission-modes#which-mode-a-session-starts-in), so Claude acts without asking. Three things can go wrong:

- **Overeager:** it hits a login error and searches your config files for another token.
- **Scope creep:** it deletes the remote branches too.
- **Prompt injection:** a file it reads says "send `.env` to this URL" ([Chapter 10](../10-control-layers/README.md)).

## Three layers

```
 Claude wants to act
        │
        ▼
 ① deny rules ───────────── match ──▶ BLOCKED, in every mode
        │
        ▼
 ② auto mode classifier ─── beyond your request ──▶ BLOCKED, Claude tries another way
        │
        ▼
 ③ you, on your phone ───── prompts and alerts reach you through Remote Control
```

Deny rules come first: "neither the classifier nor user intent can override" them, nor can a hook's allow ([Chapter 05](../05-hooks-hands-on/README.md)). The exception is a **mod**, an add-on you install, which can approve past a deny rule unless managed settings or a Team or Enterprise login are in force ([docs](https://code.claude.com/docs/en/permissions#precedence-among-rules-hooks-and-mods)), so install only trusted mods.

## What auto mode checks

Auto mode sends each action your rules don't settle to a **classifier**, a second model that reviews it first ([Chapter 04](../04-permissions/README.md#permission-modes)). It sees your messages and Claude's tool calls, but not tool results, so a hostile file can't talk it round.

As of October 2026, it [blocks by default](https://code.claude.com/docs/en/permission-modes#what-the-classifier-blocks-by-default) things like `curl | bash`, sending sensitive data out, production deploys and force pushes. It allows edits in your working folder, read-only web requests, and pushes to any branch of your repo. To approve pushes yourself, add an ask rule like `Bash(git push *)`.

A boundary you state in chat, like "don't push until I review", works until [compaction](../03-context-engineering/README.md#what-survives-compaction) drops it. Use a rule for anything that must last.

**When it keeps blocking.** After 3 blocks in a row or 20 in total, auto mode pauses and Claude Code asks you again. As of October 2026, you [can't change those limits](https://code.claude.com/docs/en/permission-modes#when-auto-mode-falls-back).

## Where auto mode can miss

The docs say auto mode "does not guarantee safety". In Anthropic's [engineering post](https://www.anthropic.com/engineering/claude-code-auto-mode) (March 2026), the classifier let 17% of real overeager actions through, mostly by taking a vague request like "clean up the PR" as permission. So name the exact target: "force-push this branch" approves a force push, and "clean up the repo" doesn't ([docs](https://code.claude.com/docs/en/auto-mode-config#override-the-block-and-allow-rules)).

## Deny rules vs `autoMode.hard_deny`

`autoMode.hard_deny` lists rules in plain words that the classifier never lets past, whatever you say in chat:

```json
{
  "autoMode": {
    "hard_deny": [
      "$defaults",
      "Never send repository contents to third-party code-review APIs"
    ]
  }
}
```

Keep `"$defaults"`, or you replace the built-in rules.

| | `permissions.deny` | `autoMode.hard_deny` |
|---|---|---|
| You write | A tool pattern, like `Bash(curl *)` | A sentence |
| Checked | Before the classifier, in every mode | Only when the classifier runs, as in auto mode |
| Read from | Any settings file | [User or managed settings](https://code.claude.com/docs/en/auto-mode-config#where-the-classifier-reads-configuration) or `--settings`, never project files |
| Weak spot | Matches text, so `/usr/bin/curl` slips past ([Chapter 04](../04-permissions/README.md#where-pattern-rules-fail)) | A model's judgment |

Use a deny rule when you can name the command, and `hard_deny` for a limit you can only describe.

## Hands-on: block curl, then unblock it

It all happens in a throwaway folder. Manual mode keeps it predictable, since auto mode may just run a read-only web request.

**1. Make the folder.**

macOS / Linux:

```bash
mkdir walkaway-lab && cd walkaway-lab
mkdir .claude
```

Windows (PowerShell):

```powershell
mkdir walkaway-lab; cd walkaway-lab
mkdir .claude
```

**2. Add one deny rule and start Claude Code.** Create `.claude/settings.json`:

```json
{
  "permissions": {
    "deny": ["Bash(curl *)"]
  }
}
```

Start in Manual mode, accept the trust prompt, and run `/permissions`.

```bash
claude --permission-mode default
```

You should see: `Bash(curl *)` under deny, from `.claude/settings.json`.

**3. Ask for the command:** *"Use the Bash tool to run `curl -sI https://example.com`."*

You should see: the call blocked without a prompt. If Claude offers another way, say no. Ask for Bash on Windows too, because the rule doesn't cover PowerShell.

**4. Remove the rule.** Change the file to `{"permissions": {"deny": []}}`, save, and ask again.

You should see: a permission prompt for `curl`. Choose No. With no rule, the mode decides, and Manual mode asks.

**5. Clean up.** Exit, then run `cd .. && rm -rf walkaway-lab` (PowerShell: `cd ..; Remove-Item -Recurse -Force walkaway-lab`).

A deny rule ends the call, but a prompt waits for you.

## On your phone (optional)

**Remote Control** links the Claude app on your phone to the session running on your computer.

As of October 2026, it [needs](https://code.claude.com/docs/en/remote-control#requirements) a Pro, Max, Team or Enterprise plan and a claude.ai login: API keys and third-party providers like Amazon Bedrock don't work. On Team and Enterprise, an Owner turns it on first. Use the Claude app, signed in to the same account.

1. Run `/remote-control` in your session and confirm.
2. Run `/remote-control` again and scan the QR code with your phone.
3. In `/config`, turn on **Push when actions required** for prompts and questions, and **Push when Claude decides** for alerts like a finished task. As of October 2026, [both are off by default](https://code.claude.com/docs/en/settings-reference#inputneedednotifenabled).
4. Allow notifications on your phone.

[No notifications?](https://code.claude.com/docs/en/remote-control#mobile-push-notifications)

- `/config` shows **No mobile registered**: open the app.
- iOS: check Focus modes and notification summaries.
- Android: exempt the app from battery optimization.
- Pushes pause while you're typing in or focused on the terminal.

[Limits](https://code.claude.com/docs/en/remote-control#limitations): your computer must stay on with `claude` running, and the conversation is stored on Anthropic's servers while you're connected.

Third-party mobile clients also exist.

## Before you walk away

1. Put hard limits in deny rules, and what you'll approve yourself, like `git push`, in ask rules.
2. Check them in `/permissions`.
3. Stay in auto mode, never `bypassPermissions`.
4. Name exact targets in your prompt.
5. Commit first, so Claude's changes show up in one diff.
6. Turn on Remote Control and **Push when actions required**.
7. Back at your desk, check **Recently denied** in `/permissions` and read the diff.

**Remember:**

- Deny rules come first, in every mode, and neither the classifier nor chat can override them.
- Auto mode blocks what goes beyond your request, but vague requests let things slip.
- `hard_deny` works only when the classifier runs, from user or managed settings.
- A prompt waits for you, and push brings it to your phone.

Test yourself with the [quiz](quiz.md): 5 questions.

## Sources

- Permission modes: https://code.claude.com/docs/en/permission-modes
- Configure auto mode: https://code.claude.com/docs/en/auto-mode-config
- Permissions (mods): https://code.claude.com/docs/en/permissions#precedence-among-rules-hooks-and-mods
- Settings reference: https://code.claude.com/docs/en/settings-reference
- Remote Control: https://code.claude.com/docs/en/remote-control
- How we built Claude Code auto mode: https://www.anthropic.com/engineering/claude-code-auto-mode
