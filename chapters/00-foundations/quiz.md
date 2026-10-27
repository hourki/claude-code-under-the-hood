# 00 — Quiz: foundations

Pick an answer. The quiz checks it and shows the explanation.

<quiz>
**1.** Claude Code runs `npm test`. Who executes the command?

- [ ] a) the model
- [x] b) the host
- [ ] c) an MCP server
- [ ] d) Anthropic's servers

**b** — the model only requests the command. The host (Claude Code) runs built-in tools like Bash.
</quiz>

<quiz>
**2.** You add a plugin that ships two skills and one hook. Does it need MCP?

- [ ] a) yes, plugins are MCP servers
- [x] b) no
- [ ] c) only for the hook
- [ ] d) only for the skills

**b** — a plugin is a package of extensions. MCP config is optional.
</quiz>

<quiz>
**3.** Yesterday you saved "staging is eu-west-3" to memory. Today Claude knows it. What happened?

- [ ] a) the model was retrained
- [ ] b) Anthropic stored it server-side
- [x] c) a file was loaded into today's context
- [ ] d) a hook injected it

**c** — memory is files loaded into context in later sessions. It never retrains the model.
</quiz>

<!-- mkdocs-quiz results -->
