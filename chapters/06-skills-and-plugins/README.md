# 06 — Skills and plugins

**In short:** a skill is a saved set of instructions Claude pulls in when it needs them. A plugin is a box that ships skills, hooks, subagents and MCP servers together.
Learn both, and you can package your setup once and reuse it everywhere.

**You'll learn:**

- what a skill is, where it lives, and when it loads
- how a plugin is laid out, and how to test one locally
- how plugins are installed, and what to check before you trust one

## A skill, first

```markdown
---
name: readme-check
description: Check a README for the sections a newcomer needs (what it is, install, usage, license) and list what's missing. Use when the user asks to review or improve a README.
---

Check the README in the current folder.

1. Read `README.md`. If there isn't one, say so and stop.
2. Look for four things: a one-line description, how to install, how to use, and the license.
3. Reply with a short table: section, found or missing, and a one-line suggestion.
4. Don't edit any file unless the user asks you to.
```

That's a whole skill: a `SKILL.md` file with YAML frontmatter (settings between the `---` lines) and Markdown instructions. At session start, only the `description` sits in context. When your request matches it, or you type `/readme-check`, Claude loads the full file.

## Skills in detail

| Location | Path | Who gets it |
|---|---|---|
| Personal | `~/.claude/skills/<name>/SKILL.md` | You, in every project |
| Project | `.claude/skills/<name>/SKILL.md` | Everyone in the repo, once committed |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Whoever installs the plugin, as `/plugin-name:name` |

Every frontmatter field is optional, but the docs recommend a `description`. These are the ones you'll use first:

| Field | What it does |
|---|---|
| `name` | The command name. Defaults to the folder name. |
| `description` | What Claude reads to decide whether to load the skill. Put the main use case first. |
| `disable-model-invocation: true` | Only you can run it. The description leaves Claude's context. |
| `user-invocable: false` | Only Claude can run it. It's hidden from the `/` menu. |
| `allowed-tools` | Pre-approves tools for the turn that runs the skill. It doesn't restrict tools. |

Once a skill runs, it stays in the conversation as one message. Keep `SKILL.md` under 500 lines, and put long reference material in extra files next to it. Edits apply live: the next turn uses the new version.

## Plugins

A plugin is a folder that Claude Code loads as one unit. Here's the one for this chapter, [`labs/readme-tools`](https://github.com/hourki/claude-code-under-the-hood/tree/main/labs/readme-tools):

```
readme-tools/
├── .claude-plugin/
│   └── plugin.json          the manifest: name, version, author
└── skills/
    └── readme-check/
        └── SKILL.md
```

```json
{
  "name": "readme-tools",
  "description": "A one-skill plugin that checks a README for the sections a newcomer needs.",
  "version": "1.0.0",
  "author": { "name": "Claude Code under the hood" }
}
```

A bigger plugin can also hold `agents/` (subagents), `hooks/hooks.json` and `.mcp.json` (MCP servers), all at the plugin root. Only `plugin.json` goes inside `.claude-plugin/`.

| Rule | Why it matters |
|---|---|
| `name` is the only required key, in kebab-case | Every component is namespaced under it: `/readme-tools:readme-check` |
| Don't start the name with `claude-` | `claude plugin validate` rejects it |
| `${CLAUDE_PLUGIN_ROOT}` points to the plugin's own folder | Use it in hook and MCP commands |
| Keep every file inside the plugin folder | An install copies only that folder into a cache. Paths that escape it are rejected. |
| A `CLAUDE.md` in a plugin isn't loaded | Ship instructions as a skill, and hard rules as a hook |

**Installing.** A marketplace is a catalog: a repo or folder with `.claude-plugin/marketplace.json`. In a session, `/plugin marketplace add <source>` adds one, and `/plugin install <plugin>@<marketplace>` installs from it. Disable or remove a plugin from the `/plugin` **Installed** tab.

**Trust.** A plugin runs code with your user's rights, and its hooks and MCP servers run outside the sandbox. Before you install one, read its `hooks/hooks.json`, `.mcp.json` and `bin/` yourself. An enabled plugin also costs context every turn, because its skill and subagent descriptions stay loaded.

## Skill, plugin or MCP server?

| You want | Use |
|---|---|
| Reusable instructions for yourself or one repo | A skill in `~/.claude/skills/` or `.claude/skills/` |
| A new capability that runs code: an API, a database | An MCP server |
| To share several pieces as one versioned unit | A plugin |

Skills, hooks, subagents and MCP servers all work without a plugin. A plugin only packages them.

## Hands-on: run a skill from a local plugin

**1. Validate the plugin.** From the repo root:

```bash
claude plugin validate ./labs/readme-tools
```

You should see: `✔ Validation passed`. A warning about a missing marketplace install line is fine for a local plugin.

**2. Make a practice folder with a thin README.**

macOS / Linux:

```bash
mkdir ~/readme-practice && cd ~/readme-practice
echo "# my-project" > README.md
```

Windows (PowerShell):

```powershell
mkdir $HOME\readme-practice; cd $HOME\readme-practice
Set-Content README.md "# my-project"
```

**3. Start Claude Code with the plugin, for this session only.** Use the path to your clone:

```bash
claude --plugin-dir <path-to-repo>/labs/readme-tools
```

`--plugin-dir` loads the folder in place and writes nothing to your settings.

**4. Run the skill.** Type `/readme-tools:readme-check`.

You should see: a short table that marks install, usage and license as missing.

**5. Let Claude pick it.** In a new session started the same way, ask: *"Can you review my README?"*

You should see: Claude loads `readme-check` on its own, because your request matches its description.

**6. Check the cost.** Run `/context`.

You should see: the skill listed under skills, costing only its description until it runs.

**7. Clean up.** Exit and delete `~/readme-practice`.

## Common mistakes

| Mistake | Reality |
|---|---|
| A vague `description` | Claude matches requests against it. Say what the skill does and when to use it. |
| Expecting `allowed-tools` to restrict tools | It pre-approves them for one turn. Use permission rules to restrict. |
| Putting `skills/` inside `.claude-plugin/` | Only `plugin.json` goes there. Components sit at the plugin root. |

**Remember:**

- A skill is a description plus instructions. Only the description loads up front.
- A plugin packages skills, hooks, subagents and MCP servers under one name.
- Test locally with `claude plugin validate` and `--plugin-dir`.
- Read a plugin's hooks and servers before you trust it.

Test yourself with the [quiz](quiz.md): 5 questions.

## Sources

Checked against these pages on 2026-10-26. If they disagree with this chapter, trust them.

- Skills: https://code.claude.com/docs/en/skills
- Plugins overview: https://code.claude.com/docs/en/plugins/overview
- Create a plugin: https://code.claude.com/docs/en/plugins/create
- Plugin components: https://code.claude.com/docs/en/plugins/components
- Plugin manifest reference: https://code.claude.com/docs/en/plugins/manifest-reference
- Install plugins: https://code.claude.com/docs/en/plugins/install
- Plugin security: https://code.claude.com/docs/en/plugins/security
