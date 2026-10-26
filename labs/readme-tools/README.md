# readme-tools

A one-skill Claude Code plugin, used in [Chapter 06](../../chapters/06-skills-and-plugins/README.md).

## Run it

From the repo root:

```bash
claude plugin validate ./labs/readme-tools
claude --plugin-dir ./labs/readme-tools
```

You should see: `✔ Validation passed`, then a normal Claude Code session.

In the session, type `/readme-tools:readme-check`.

You should see: a short table of the README sections that are found or missing.

## Files

| File | Role |
|---|---|
| `.claude-plugin/plugin.json` | The manifest: the plugin's name, version and author |
| `skills/readme-check/SKILL.md` | The skill: a description and the instructions |
