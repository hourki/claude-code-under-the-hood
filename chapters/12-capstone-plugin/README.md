# 12 — Capstone: one plugin, three parts

**In short:** you'll ship the notes MCP server, a skill and a hook as one plugin, then load and test it.
Every part comes from an earlier chapter.

**You'll learn:**

- how a plugin declares an MCP server, a skill and a hook
- how plugin names change tool names and hook matchers
- how to validate and test a plugin before anyone installs it

## The plugin, first

```
claude --plugin-dir . plugin details notes-kit
```

```
notes-kit 1.0.0
  Description: The notes MCP server, a notes-review skill, and a hook that protects pinned notes.
  Source: notes-kit@inline

Component inventory
  Skills (1)  notes-review
  Agents (0)
  Hooks (1)  PreToolUse  (harness-only — no model context cost)
  MCP servers (1)  notes  (tool schemas resolved at runtime; not counted)
  LSP servers (0)

Projected token cost
  Always-on:   ~82 tok   added to every session
```

That's the real output for [`labs/notes-mcp`](https://github.com/hourki/claude-code-under-the-hood/tree/main/labs/notes-mcp), which is also a plugin called `notes-kit`. One folder holds the server from [Chapter 09](../09-build-an-mcp-server/README.md), a skill like the one in [Chapter 06](../06-skills-and-plugins/README.md), and a hook like the ones in [Chapter 05](../05-hooks-hands-on/README.md). The always-on cost is only the skill's description.

## How the parts are declared

```
labs/notes-mcp/
├── .claude-plugin/plugin.json      manifest + the MCP server
├── skills/notes-review/SKILL.md    the skill
├── hooks/hooks.json                the hook
├── src/                            TypeScript sources
└── dist/                           built JavaScript (npm run build)
```

**The manifest** names the plugin and declares the server inline:

```json
{
  "name": "notes-kit",
  "description": "The notes MCP server, a notes-review skill, and a hook that protects pinned notes.",
  "version": "1.0.0",
  "author": { "name": "Claude Code under the hood" },
  "mcpServers": {
    "notes": { "command": "node", "args": ["${CLAUDE_PLUGIN_ROOT}/dist/stdio.js"] }
  }
}
```

`${CLAUDE_PLUGIN_ROOT}` is the plugin's own folder, wherever it ends up. A plugin can also declare servers in a `.mcp.json` at its root. This one uses the manifest, so the Chapter 09 folder doesn't also pick up a project `.mcp.json`.

**The hook** guards one tool:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__plugin_notes-kit_notes__delete_note",
        "hooks": [{ "type": "command", "command": "node", "args": ["${CLAUDE_PLUGIN_ROOT}/dist/guard-delete.js"] }]
      }
    ]
  }
}
```

Look at the matcher. Inside a plugin, MCP tools are named `mcp__plugin_<plugin>_<server>__<tool>`, so `delete_note` becomes `mcp__plugin_notes-kit_notes__delete_note`. Use that full name in hooks and permission rules.

`hooks/hooks.json` also needs the outer `"hooks"` key, or it won't load. The hook script, `src/guard-delete.ts`, refuses to delete any note whose title starts with "pinned". Plugin hooks fire as soon as the plugin loads, not only when its skill runs.

**The skill** tells Claude how to review notes: list them, read `notes://all`, suggest keep, merge, delete or pin, and delete nothing until you say yes. It runs as `/notes-kit:notes-review`.

## What a plugin can't do for you

| Rule | So you must |
|---|---|
| Claude Code doesn't build plugins | Ship `dist/` already built |
| `--plugin-dir` loads the folder in place, with no install step | Run `npm install` yourself |
| `${CLAUDE_PLUGIN_ROOT}` changes on every update | Store lasting data in `${CLAUDE_PLUGIN_DATA}`. This lab keeps `notes.json` next to the code, which is fine with `--plugin-dir` but should move before you publish. |

The other packaging rules from [Chapter 06](../06-skills-and-plugins/README.md#plugins) still apply: keep every file inside the plugin folder, and don't start the name with `claude-`.

## Hands-on: load and test `notes-kit`

**1. Build it and run the tests.** Same on every OS:

```bash
cd labs/notes-mcp
npm install
npm run build
npm test
```

You should see: `ℹ pass 4` and `ℹ fail 0`.

**2. Validate it.**

```bash
claude plugin validate .
```

You should see: `✔ Validation passed`. Advice about a missing marketplace install line is fine for a local plugin.

**3. Check the inventory.**

```bash
claude --plugin-dir . plugin details notes-kit
```

You should see: the component inventory at the top of this chapter.

**4. Start a session with the plugin**, from a practice folder so nothing mixes with your own setup.

macOS / Linux:

```bash
mkdir ~/plugin-practice && cd ~/plugin-practice
claude --plugin-dir <path-to-repo>/labs/notes-mcp
```

Windows (PowerShell):

```powershell
mkdir $HOME\plugin-practice; cd $HOME\plugin-practice
claude --plugin-dir <path-to-repo>\labs\notes-mcp
```

If you added `notes` with `claude mcp add` in Chapter 09, it doesn't clash: the plugin's server has its own name.

**5. Look around.** Run `/mcp`, then `/hooks`.

You should see: the server listed as `plugin:notes-kit:notes`, and a `PreToolUse` hook for `mcp__plugin_notes-kit_notes__delete_note`.

**6. Add two notes.** Ask: *"Add a note titled pinned wifi with the text: network name is example-net. Then add a note titled old idea with the text: try MCP."*

**7. Try to delete the pinned one.** Ask: *"Delete the note titled pinned wifi."*

You should see: the call is blocked with the hook's "is pinned" reason, before any permission prompt, because `PreToolUse` hooks run first. Check `notes.json`: the note is still there.

Now ask: *"Delete the note titled old idea."* This time the hook stays silent, so you get the permission prompt that `delete_note` always shows. Approve it, and the note is gone.

**8. Run the skill.** Type `/notes-kit:notes-review`.

You should see: a table with a suggestion for each note. Nothing changes until you agree.

**9. Clean up.** Exit, delete `~/plugin-practice`, and delete the test notes from `notes.json`.

## Where to go next

- **Share it:** create a marketplace (a repo with `.claude-plugin/marketplace.json`) and install with `/plugin install notes-kit@<marketplace>`.
- **Harden it:** apply the [Chapter 11](../11-mcp-security/README.md#checklist-the-notes-server) checklist before anyone else installs it.

## Common mistakes

| Mistake | Reality |
|---|---|
| A hook matcher using `mcp__notes__delete_note` | Inside a plugin the tool is `mcp__plugin_notes-kit_notes__delete_note`. |
| Forgetting `npm run build` | `dist/` is what runs. Claude Code won't build it for you. |
| `hooks/hooks.json` without the outer `"hooks"` key | It fails to load. |

**Remember:**

- One plugin folder can hold an MCP server, skills, hooks and subagents.
- Plugin MCP tools are named `mcp__plugin_<plugin>_<server>__<tool>`.
- Ship it built, keep it self-contained, and validate it before sharing.
- Plugin hooks fire as soon as the plugin loads.

Test yourself with the [quiz](quiz.md): 5 questions.

## Sources

Checked against these pages on 2026-10-26. If they disagree with this chapter, trust them.

- Create a plugin: https://code.claude.com/docs/en/plugins/create
- Plugin components (MCP servers, hooks, names): https://code.claude.com/docs/en/plugins/components
- Plugin manifest reference: https://code.claude.com/docs/en/plugins/manifest-reference
- Plugin commands: https://code.claude.com/docs/en/plugins/cli-reference
- Hooks (matching MCP tools): https://code.claude.com/docs/en/hooks#match-mcp-tools
- Claude Code MCP (require approval for a tool): https://code.claude.com/docs/en/mcp#require-approval-for-a-specific-tool
