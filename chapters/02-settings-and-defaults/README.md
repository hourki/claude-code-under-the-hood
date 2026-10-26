# 02 — Settings and defaults: your Claude Code setup

**In short:** Claude Code reads its settings from a few JSON files, and some files override others.
Know where they live and which one wins, and you can change your setup without surprises.

**You'll learn:**

- where each settings file lives, and who should edit it
- which file wins when two disagree, and what's on by default
- how to look at your setup and change one setting safely

## A settings file, first

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": ["Bash(npm run lint)", "Bash(npm run test *)"],
    "deny": ["Read(./.env)", "Read(./.env.*)"]
  }
}
```

This is a project settings file, `.claude/settings.json`. Settings are plain JSON: keys and values. Claude Code reads them at start and picks up most edits while it runs.

| Part | Why it's there |
|---|---|
| `$schema` | Your editor can autocomplete and check the keys |
| `allow`: `Bash(npm run lint)`, `Bash(npm run test *)` | Your everyday commands run without a prompt |
| `deny`: `Read(./.env)`, `Read(./.env.*)` | Claude's file tools can't read your secrets files. Bash commands like `cat .env` aren't covered by `Read` rules. |

Commit it, and the whole team gets it.

## The settings files

| Scope | File | Who it affects | Commit it? |
|---|---|---|---|
| User | `~/.claude/settings.json` | You, in every project on this machine | No, it's in your home folder |
| Project | `.claude/settings.json` | Everyone who works in that folder | Yes, so teammates get it |
| Local | `.claude/settings.local.json` | You, in this project only | No |
| Managed | Set by your organization | Everyone the org deploys it to | You don't edit it |

`~/.claude` is the `.claude` folder in your home directory (`%USERPROFILE%\.claude` on Windows). A plain `.claude` is the folder inside your project. Managed settings come from your organization, as a system file or from an admin console.

- No settings file exists after install. `~/.claude/settings.json` appears when you first change an option in `/config`, and `.claude/settings.local.json` when you first answer "Yes, and don't ask again".
- `~/.claude.json` is a different file that Claude Code manages itself: your account, MCP servers, folder trust. Don't put `permissions`, `hooks` or `env` there.
- `CLAUDE.md` isn't a settings file. It holds instructions for the model.

## Which file wins

```
managed settings               ← your organization; nothing overrides it
  --settings (command line)    ← this session only
    .claude/settings.local.json  ← you, this project
      .claude/settings.json      ← the team
        ~/.claude/settings.json  ← you, everywhere
```

A key set higher up overrides the same key lower down. Say your user file sets `"spinnerTipsEnabled": false` and the team's project file sets it to `true`: in that project, the tips show. To turn them off just for you, put `false` in `.claude/settings.local.json`.

Three rules change how that plays out:

- **Lists merge.** A list like `permissions.allow` is combined across files, not replaced. A deny rule in any file beats an allow rule in another.
- **Environment variables follow their own rules.** For example, `ANTHROPIC_MODEL` beats `model` from any file.
- **Some keys only work from your user file.** For example, `defaultMode: "auto"` in a project file is ignored.

Allow rules in a committed project file also wait until each teammate trusts the folder. Deny and ask rules apply right away.

## What's on by default

As of October 2026. Defaults change, so each row links to its docs page.

| Setting | Default |
|---|---|
| [Starting permission mode](https://code.claude.com/docs/en/permission-modes#which-mode-a-session-starts-in) | `auto` in the terminal and VS Code: Claude acts without asking, while a separate safety check reviews each action. `default` (ask before most actions) for `claude -p` and the SDK. |
| [Model](https://code.claude.com/docs/en/model-config#default-model-setting) | Unset, so your account's default applies: Opus 5.5 on most plans and providers |
| [Auto memory](https://code.claude.com/docs/en/memory#enable-or-disable-auto-memory) | On: Claude keeps notes for itself in `MEMORY.md` and loads the start of it each session |
| [Sandbox](https://code.claude.com/docs/en/settings-reference#sandbox-enabled) | Off. The sandbox is an OS-level limit on which files and network addresses Bash commands can reach. |
| [MCP tool search](https://code.claude.com/docs/en/mcp#configure-tool-search) | On: MCP tool schemas load only when needed |
| [Commit attribution](https://code.claude.com/docs/en/settings-reference#attribution-commit) | On: commits get a `Co-Authored-By` line for Claude |

## Look at your setup

These only show things:

| Command | What it shows |
|---|---|
| `/status` | Version, model, account, and a `Setting sources` line listing every settings file that loaded |
| `/context` | What's using the context window, including which `CLAUDE.md` files loaded |
| `/hooks` | Every configured hook and where it comes from |
| `claude doctor` | Run in the terminal, not in a session. Install health and settings files that don't parse. |

These show your setup too, but they can also change it:

| Command | Watch out for |
|---|---|
| `/permissions` | Lists every rule and its file, and lets you add or remove rules |
| `/config` | Changes personal options like the theme |
| `/model` | `Enter` saves the model as your default. `s` switches for this session only. |
| `/mcp` | Can reconnect, enable or disable servers |

No command shows which file set a given key. `Setting sources` lists the files, not the keys.

## Change one setting safely

1. **Try it for one session.** `claude --settings try.json` sits above your own files and writes nothing.
2. **Back up the file you'll edit**, for example `cp .claude/settings.json .claude/settings.json.bak` (PowerShell: `Copy-Item`).
3. **Edit it.** It's strict JSON: a `//` comment or a trailing comma is a syntax error.
4. **Check it.** `/status` should list the file under `Setting sources`, and `claude doctor` catches parse errors. `model` is read only at start, so switch models with `/model`.
5. **Roll back if needed.** Copy the backup over the file. If a broken setup won't start, `claude --safe-mode` starts with your customizations off.

> **Keep it private.** Values in `env` are plain text, and every command Claude runs can see them, so use `apiKeyHelper` for API credentials. Never commit `.claude/settings.local.json`. Claude Code keeps it out of git only when it created the file itself.

## Common mistakes

| Mistake | Reality |
|---|---|
| "My user setting is ignored in this repo" | The team's project file wins. Override it in `.claude/settings.local.json`. |
| A comment in the JSON | Strict JSON. You'll get a Settings Error at the next start. |
| Changing `model` in a file mid-session | It's read at start. Use `/model`. |

## Hands-on: look, add one rule, clean up

You'll work in a new empty folder. Your user settings never change.

**1. Make an empty practice folder.**

macOS / Linux:

```bash
mkdir ~/settings-practice && cd ~/settings-practice
```

Windows (PowerShell):

```powershell
mkdir $HOME\settings-practice; cd $HOME\settings-practice
```

**2. Run the read-only checkup.**

```bash
claude doctor
```

You should see: a report on your install and your settings files. Nothing changes.

**3. Look at your setup.** Start `claude`, accept the trust prompt, and run `/status`.

You should see: your version, model and account, plus a `Setting sources` line. It's your own setup, so don't paste it anywhere public.

**4. Add one harmless rule, in this folder only.** Exit Claude Code, then create `.claude/settings.json`.

macOS / Linux:

```bash
mkdir .claude
echo '{"permissions": {"deny": ["Read(./practice-secret.txt)"]}}' > .claude/settings.json
```

Windows (PowerShell):

```powershell
mkdir .claude
Set-Content .claude\settings.json '{"permissions": {"deny": ["Read(./practice-secret.txt)"]}}'
```

The file `practice-secret.txt` doesn't need to exist.

**5. Check that it loaded.** Start `claude` again and run `/status`.

You should see: the project settings file listed under `Setting sources`.

Run `/permissions`.

You should see: your `Read(./practice-secret.txt)` deny rule, with `.claude/settings.json` as its source.

**6. Clean up.** Exit and delete the folder: `cd .. && rm -rf settings-practice` (PowerShell: `cd ..; Remove-Item -Recurse -Force settings-practice`).

**Remember:**

- Five levels, highest first: managed, `--settings`, local, project, user.
- Lists merge, and a deny anywhere wins.
- `/status` shows which files loaded. `claude doctor` checks them.
- Try a change with `--settings` first, and back up before you edit.
- Personal and secret things stay out of git.

Test yourself with the [quiz](quiz.md): 5 questions.

## Sources

Checked against these pages on 2026-10-26. If they disagree with this chapter, trust them.

- Settings: https://code.claude.com/docs/en/settings
- Settings reference: https://code.claude.com/docs/en/settings-reference
- Managed settings: https://code.claude.com/docs/en/managed-settings
- Permission modes (starting mode): https://code.claude.com/docs/en/permission-modes
- Model configuration: https://code.claude.com/docs/en/model-config
- Commands: https://code.claude.com/docs/en/commands
- CLI reference (`claude doctor`, `--settings`): https://code.claude.com/docs/en/cli-reference
- Debug your config (`--safe-mode`): https://code.claude.com/docs/en/debug-your-config
