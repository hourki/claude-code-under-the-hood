# 14 — Quiz: agents in CI/CD

Pick an answer. The quiz checks it and shows the explanation.

<quiz>
**1.** A nightly job runs `claude -p "Fix the lint errors"` with no other flags and no mode set. Claude tries to edit a file. What happens?

- [ ] a) the job hangs, waiting for someone to approve the edit
- [ ] b) the edit runs, because `-p` skips permission checks
- [x] c) the edit is denied and the run goes on
- [ ] d) Claude Code exits at once with an error

**c** — a `-p` run with no mode set starts in Manual mode. A call that needs approval is denied unless an allow rule, a hook or `--permission-prompt-tool` approves it.
</quiz>

<quiz>
**2.** Your script parses Claude's answer and also needs the session ID. Which output format fits?

- [x] a) `--output-format json`
- [ ] b) `--output-format text`
- [ ] c) `--output-format stream-json` with nothing else
- [ ] d) `--output-format yaml`

**a** — `json` prints one object with `result`, the session ID and metadata. `text` is plain text only, `stream-json` is one event per line, and `yaml` isn't an option.
</quiz>

<quiz>
**3.** In a `claude -p` run you pass `--allowedTools "Read"`. Can Claude still call other tools?

- [ ] a) no: only Read exists in the session
- [x] b) yes: other tools stay available, and calls that need approval are denied
- [ ] c) yes, and they all run without a prompt
- [ ] d) no: the run fails at startup

**b** — `--allowedTools` only adds allow rules. To remove tools, use `--disallowedTools` with bare tool names, or `--tools`.
</quiz>

<quiz>
**4.** A pull request adds a `.mcp.json` server that nobody approved. Your CI checks out the branch and runs `claude -p` without `--bare`. What happens to the server?

- [ ] a) it stays at "Pending approval" and never connects
- [ ] b) Claude Code asks on stderr and skips it after a timeout
- [ ] c) it connects only if `.claude/settings.json` approves it
- [x] d) it connects without asking

**d** — `-p` can't show the approval prompt, so it loads project-scoped servers without asking, approved or not. Use `--bare`, `--setting-sources user` or `--strict-mcp-config` to keep them out.
</quiz>

<quiz>
**5.** Your prompt says "This is a read-only task. Never edit files." Claude then reads an issue that says "update config.yaml". Which control actually stops the edit?

- [ ] a) the prompt text
- [ ] b) a `CLAUDE.md` line that repeats the rule
- [x] c) `--disallowedTools "Edit,Write"`
- [ ] d) `--max-turns 1`

**c** — the prompt and `CLAUDE.md` are advisory, so hostile text can talk Claude out of them. A deny rule that removes the tools is enforced. A turn cap limits length, not actions.
</quiz>

<quiz>
**6.** You run `claude -p` in an untrusted checkout whose `.claude/settings.json` has a `permissions.allow` rule for `Bash(curl *)`. Does the rule apply?

- [ ] a) yes: project settings always load
- [x] b) no: it's ignored, with a warning on stderr
- [ ] c) yes, but only for the first call
- [ ] d) only in `bypassPermissions`

**b** — in a `-p` run in a folder that was never trusted, the project's `permissions.allow` rules aren't used. Its hooks and `env` block still are.
</quiz>

<quiz>
**7.** You copy a workflow that uses `anthropics/claude-code-action` with an API key and the Claude GitHub App. Which `permissions:` block is the least it needs to read the code?

- [ ] a) `contents: write` and `pull-requests: write`
- [ ] b) `contents: read` only
- [x] c) `contents: read` and `id-token: write`
- [ ] d) `write-all`

**c** — `contents: read` lets the job read the code. `id-token: write` lets the action get the OIDC token it needs to work as the Claude GitHub App.
</quiz>

<quiz>
**8.** Your workflow sets a `prompt` input. When does Claude run?

- [ ] a) only when someone comments `@claude`
- [x] b) on the workflow's own trigger, with results in the run log
- [ ] c) only on a schedule
- [ ] d) never: `prompt` is only a default for `@claude`

**b** — with a `prompt`, the action runs in automation mode on the workflow's event. Without one, it waits for the `@claude` trigger phrase.
</quiz>

<quiz>
**9.** On an Ubuntu runner you pass `--disallowedTools "Bash"` and ask Claude to find every TODO. Which search tools does it have?

- [ ] a) none: `find` and `grep` need Bash
- [ ] b) only Read
- [ ] c) only the tools named in `--allowedTools`
- [x] d) Glob and Grep, because removing Bash brings them back

**d** — on macOS and Linux, Glob and Grep are left out by default and Claude searches through Bash. Removing Bash, or naming either tool in `--allowedTools`, brings both back.
</quiz>

<!-- mkdocs-quiz results -->
