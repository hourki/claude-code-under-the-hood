# 06 — Quiz: skills and plugins

Answer each question first, then open **Answer** to check it.

**1.** A skill has `disable-model-invocation: true`. What changes?

- a) nobody can run it
- b) only you can run it, with `/name`, and its description leaves Claude's context
- c) it runs on every prompt
- d) it loads its full body at session start

<details markdown="1"><summary>Answer</summary>

**b** — Claude can no longer pick it on its own. You still can, from the `/` menu.

</details>

**2.** A plugin named `my-first-plugin` has `skills/hello/SKILL.md`. How do you run that skill?

- a) `/hello`
- b) `/my-first-plugin:hello`
- c) `@hello`
- d) `/plugin hello`

<details markdown="1"><summary>Answer</summary>

**b** — every plugin component is namespaced under the plugin's name, so plugins never collide.

</details>

**3.** Your plugin's hook runs `../shared/check.sh`, outside the plugin folder. It works with `--plugin-dir`, but fails after a marketplace install. Why?

- a) marketplace installs disable hooks
- b) installs are copied into a cache, and files outside the plugin folder aren't copied
- c) shell scripts aren't allowed in plugins
- d) `--plugin-dir` is required to run hooks

<details markdown="1"><summary>Answer</summary>

**b** — `--plugin-dir` loads the folder in place. An install copies only the plugin directory, so keep everything inside it.

</details>

**4.** A skill lists `allowed-tools: Bash(npm test)`. What does that do?

- a) Claude can use only `npm test` while the skill runs
- b) `npm test` runs without a prompt during the turn that invokes the skill; other tools stay available
- c) it adds a deny rule for every other command
- d) it installs npm

<details markdown="1"><summary>Answer</summary>

**b** — `allowed-tools` pre-approves. It doesn't restrict which tools Claude can use.

</details>

**5.** You enable a plugin with five skills but never use it today. Does it cost you anything?

- a) no: plugins load only when used
- b) yes: the names and descriptions of its model-invocable skills sit in context every turn, and its hooks and MCP servers are active
- c) only disk space
- d) only when you run `/plugin`

<details markdown="1"><summary>Answer</summary>

**b** — an enabled plugin adds its labels to every session. Disable what you don't use.

</details>
