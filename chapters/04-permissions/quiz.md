# 04 — Quiz: permissions

Pick an answer. The quiz checks it and shows the explanation.

<quiz>
**1.** Your rules are `"deny": ["Bash(aws *)"]` and `"allow": ["Bash(aws s3 ls)"]`. Claude runs `aws s3 ls`. What happens?

- [ ] a) it runs: the allow rule is more specific
- [x] b) it's blocked: deny is checked first, and specificity doesn't matter
- [ ] c) you get a prompt
- [ ] d) the mode decides

**b** — deny, then ask, then allow. The first match wins, so the broad deny wins.
</quiz>

<quiz>
**2.** Your user settings deny `Read(./.env)`. A project's `.claude/settings.json` allows it. Can Claude read `.env` in that project?

- [ ] a) yes: project settings override user settings
- [x] b) no: a deny in any settings file can't be allowed by another
- [ ] c) only after a restart
- [ ] d) only in `bypassPermissions`

**b** — permission lists merge across files, and a deny at any level holds.
</quiz>

<quiz>
**3.** You deny `Read(./.env)`. Claude then runs `grep -r API_KEY .` with Bash. What decides whether that runs?

- [ ] a) the `Read` deny blocks it
- [x] b) Bash rules and the mode: a `Read` rule doesn't cover that command
- [ ] c) the model's own judgment
- [ ] d) nothing: Bash always runs

**b** — Read rules cover the file tools and Bash commands that name the file, like `cat .env`. A `grep -r` that doesn't name it isn't covered. Use the sandbox to stop every process from reading a file.
</quiz>

<quiz>
**4.** You put `"defaultMode": "bypassPermissions"` in a project's `.claude/settings.json`. What happens at the next start?

- [ ] a) the session starts in bypass mode
- [ ] b) Claude Code refuses to start
- [x] c) it's ignored: that mode can't be set as default from a project file
- [ ] d) it starts in plan mode

**c** — `auto` and `bypassPermissions` as `defaultMode` take effect only from user or managed settings. Here the session starts in Manual mode.
</quiz>

<quiz>
**5.** You use auto mode and have an ask rule `Bash(git push *)`. Claude wants to push. What happens?

- [ ] a) the classifier decides alone
- [ ] b) it runs: auto mode runs everything
- [x] c) you get a prompt: explicit ask rules still prompt in auto mode
- [ ] d) it's denied

**c** — auto mode adds background checks, but your ask rules keep their prompt.
</quiz>

<!-- mkdocs-quiz results -->
