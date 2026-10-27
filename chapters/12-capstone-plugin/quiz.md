# 12 — Quiz: capstone plugin

Answer each question first, then open **Answer** to check it.

**1.** Your plugin `notes-kit` declares a server `notes` with a tool `delete_note`. Your hook matcher is `mcp__notes__delete_note`. Does it fire?

- a) yes
- b) no: inside a plugin the tool is named `mcp__plugin_notes-kit_notes__delete_note`
- c) only after `/reload-plugins`
- d) only for skills

<details markdown="1"><summary>Answer</summary>

**b** — plugin MCP tools carry the plugin name. Use the full name in hooks and permission rules.

</details>

**2.** You load your plugin with `--plugin-dir` but forgot `npm run build`. What happens?

- a) Claude Code builds it for you
- b) the server can't start, because `dist/` doesn't exist
- c) the TypeScript runs directly
- d) validation builds it

<details markdown="1"><summary>Answer</summary>

**b** — Claude Code runs no build step. Ship plugins already built.

</details>

**3.** A published plugin keeps its data file in `${CLAUDE_PLUGIN_ROOT}`. What goes wrong?

- a) nothing
- b) that folder changes on every update, so the data is left behind
- c) the file is public
- d) the plugin fails validation

<details markdown="1"><summary>Answer</summary>

**b** — use `${CLAUDE_PLUGIN_DATA}` for anything that must survive updates.

</details>

**4.** `delete_note` always asks for permission, and the plugin's `PreToolUse` hook denies deleting pinned notes. Claude tries to delete a pinned note. What do you see?

- a) a permission prompt, then the note is deleted
- b) the hook blocks the call before any permission prompt appears
- c) a prompt, then the hook blocks it after you approve
- d) the skill asks you first

<details markdown="1"><summary>Answer</summary>

**b** — `PreToolUse` hooks run before permission checks. A deny there ends the call, so no prompt is shown.

</details>

**5.** Your plugin's hook calls `../shared/check.js`, a file next to the plugin folder. After a teammate installs it from your marketplace, the hook fails. Why?

- a) hooks can't run Node scripts
- b) installs copy only the plugin folder, so the outside file is missing
- c) marketplaces disable hooks
- d) `../` paths need `--plugin-dir`

<details markdown="1"><summary>Answer</summary>

**b** — keep every file a plugin needs inside its own folder.

</details>
