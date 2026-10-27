# 00 — Quiz: foundations

Answer each question first, then open **Answer** to check it.

**1.** Claude Code runs `npm test`. Who executes the command?

- a) the model
- b) the host
- c) an MCP server
- d) Anthropic's servers

<details markdown="1"><summary>Answer</summary>

**b** — the model only requests the command. The host (Claude Code) runs built-in tools like Bash.

</details>

**2.** You add a plugin that ships two skills and one hook. Does it need MCP?

- a) yes, plugins are MCP servers
- b) no
- c) only for the hook
- d) only for the skills

<details markdown="1"><summary>Answer</summary>

**b** — a plugin is a package of extensions. MCP config is optional.

</details>

**3.** Yesterday you saved "staging is eu-west-3" to memory. Today Claude knows it. What happened?

- a) the model was retrained
- b) Anthropic stored it server-side
- c) a file was loaded into today's context
- d) a hook injected it

<details markdown="1"><summary>Answer</summary>

**c** — memory is files loaded into context in later sessions. It never retrains the model.

</details>
