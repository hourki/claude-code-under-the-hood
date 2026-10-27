# 02 — Quiz: settings and defaults

Pick an answer. The quiz checks it and shows the explanation.

<quiz>
**1.** Your user settings say `"spinnerTipsEnabled": false`. The team's `.claude/settings.json` says `true`. What do you get in that project?

- [ ] a) no tips: your personal choice wins
- [x] b) tips: the project file is higher than the user file
- [ ] c) a settings error
- [ ] d) it alternates between sessions

**b** — project settings override user settings. Put `false` in `.claude/settings.local.json` to change it just for you.
</quiz>

<quiz>
**2.** Your user file allows `Bash(npm run test *)`. The project file denies the same rule. Does `npm run test` run without asking?

- [ ] a) yes: allow lists merge, so it's allowed
- [x] b) no: the lists merge, and a deny in any file wins
- [ ] c) yes: user settings are checked last
- [ ] d) only in `bypassPermissions`

**b** — `permissions` lists combine across files, and deny beats allow.
</quiz>

<quiz>
**3.** The team file sets one model. You want a different model, only for yourself, only in this repo. Where does it go?

- [ ] a) `~/.claude/settings.json`
- [ ] b) the team's `.claude/settings.json`
- [x] c) `.claude/settings.local.json`
- [ ] d) `CLAUDE.md`

**c** — the local file is personal, scoped to this project, and ranks above the team file.
</quiz>

<quiz>
**4.** You want to test a new setting without touching any file. What's the safe way?

- [ ] a) edit `~/.claude/settings.json` and hope
- [x] b) start one session with `claude --settings <file or JSON>`, which writes nothing
- [ ] c) edit `~/.claude.json`
- [ ] d) add it to `CLAUDE.md`

**b** — `--settings` applies for that session only. When you're happy, back up the real file, edit it, and check `/status`.
</quiz>

<quiz>
**5.** A teammate adds an API key to `env` in the committed `.claude/settings.json`. What's wrong with that?

- [ ] a) nothing: settings files are encrypted
- [ ] b) only that `env` keys are ignored
- [x] c) the key is plain text in the repo, and every command Claude runs can see it
- [ ] d) it only works on macOS

**c** — `env` values are plain text and reach every subprocess. Use `apiKeyHelper`, and keep secrets out of git.
</quiz>

<!-- mkdocs-quiz results -->
