# 14 — Agents in CI/CD

**In short:** run Claude Code with nobody at the keyboard, and decide up front what it may do.
In CI no one answers a permission prompt, so only the controls you set before the run count.

**You'll learn:**

- how `claude -p` takes input, prints output and exits
- what happens to a call that would need your approval
- how to run the Claude GitHub Action with the least access

## A headless run, first

```bash
cat build-error.txt | claude -p "concisely explain the root cause of this build error" --output-format json
```

`-p` (or `--print`) runs one task without the interactive screen, prints the answer and exits. That's **headless mode**: the same agent loop, driven by a script instead of a person.

| Part | Behavior |
|---|---|
| Input | The prompt argument, plus anything piped into stdin (10MB cap) |
| `--output-format text` | The default: plain text |
| `--output-format json` | One object: `result`, session ID, metadata such as `total_cost_usd` |
| `--output-format stream-json` | One JSON event per line, ending with the `result` message |
| Exit code | 0 on success, non-zero on failure. A bad flag errors on stderr. A failure inside the run, like missing auth, prints on stdout. |

| CI flag | Effect |
|---|---|
| `--allowedTools "Read,Grep"` | Allow rules: these run without a prompt. Other tools stay available. |
| `--disallowedTools "Bash,Edit"` | Deny rules. A bare tool name removes the tool. |
| `--tools "Read,Grep"` | Only these built-in tools exist. MCP tools aren't affected. |
| `--max-turns 5` | Caps the agentic turns, then exits with an error |
| `--permission-mode` | The starting mode from [Chapter 04](../04-permissions/README.md#permission-modes) |

On macOS and Linux, Glob and Grep aren't in the default tool set. Naming either in `--allowedTools` brings both back, and so does removing `Bash`.

## No human to approve

```
 tool call in a claude -p run
          │
          ▼
 hook, rule or mode decides? ── yes ──▶ allow or deny, as in Chapter 10
          │ no: it would prompt
          ▼
 nobody to ask ──▶ DENIED, and the run goes on
```

As of October 2026, a `-p` run starts in Manual mode when nothing sets a mode ([docs](https://code.claude.com/docs/en/permission-modes#which-mode-a-session-starts-in)). A call that needs approval is denied unless an allow rule, a `PermissionRequest` hook or `--permission-prompt-tool` approves it. Calls that need no approval, like file reads in the working directory, still run.

This is where [enforced controls](../10-control-layers/README.md) matter most. Nobody watches the run, and the agent may read hostile text in an issue or a diff. "Don't edit files" in the prompt is advisory, while `--disallowedTools "Edit"` removes the tool.

The checked-out repo's `.claude/settings.json` can set `defaultMode` to `acceptEdits`, and then edits run without a prompt.

## What a checked-out repo can run

Without `--bare`, `-p` loads repo content but never shows the trust dialog:

| The repo supplies | In `claude -p` |
|---|---|
| Hooks and the `env` block in its settings | Used |
| `permissions.allow` rules in `.claude/settings.json` | Not used, with a warning on stderr |
| Servers in `.mcp.json` ([Chapter 08](../08-mcp-fundamentals/README.md)) | Connected without asking, approved or not |

A branch that adds a hook or a server runs code on your runner. To keep it out:

- `--bare` skips the project's hooks, skills, plugins, `.mcp.json` and `CLAUDE.md`. It needs `ANTHROPIC_API_KEY`, not a subscription login.
- `--setting-sources user` skips the project's settings files and `.mcp.json`.
- `--strict-mcp-config` uses only the servers you pass with `--mcp-config`.

The docs recommend `--bare` for scripts.

## The Claude GitHub Action

`anthropics/claude-code-action` runs Claude Code in a GitHub Actions workflow. It's built on the Agent SDK from [Chapter 13](../13-build-your-own-harness/README.md). Without a `prompt` input, it waits for `@claude` in an issue or PR and answers there. With a `prompt`, it runs on the workflow's event and writes results to the run log.

**Setup.** Run `/install-github-app` in Claude Code, or do it by hand:

1. Install the [Claude GitHub App](https://github.com/apps/claude). The action uses its Contents, Issues and Pull requests access, but you accept the app's full permission set.
2. Add a repository secret: `ANTHROPIC_API_KEY` (a Console API key) or `CLAUDE_CODE_OAUTH_TOKEN` (from `claude setup-token`).
3. Add a workflow that passes the secret to `anthropic_api_key` (or `claude_code_oauth_token`), the task to `prompt`, and CLI flags to `claude_args`.

**Permissions.** The `permissions:` block limits the job's GitHub token. `id-token: write` lets the action get an OIDC token, a short-lived identity from GitHub, which it needs to act as the Claude GitHub App.

With a plain-text prompt, Claude has no shell or GitHub API access until you grant those tools.

## Hands-on: a read-only CI agent

You need a GitHub repo of your own, with admin access. The workflow is [labs/ci-agent/claude-readonly.yml](https://github.com/hourki/claude-code-under-the-hood/blob/main/labs/ci-agent/claude-readonly.yml), and the [lab README](https://github.com/hourki/claude-code-under-the-hood/tree/main/labs/ci-agent) explains each line:

```yaml
on:
  workflow_dispatch:
permissions:
  contents: read
  id-token: write
...
          claude_args: |
            --allowedTools "Read,Glob,Grep"
            --disallowedTools "Bash,Edit,Write"
            --max-turns 5
```

**1. Copy the workflow into your repo.** From the root of `<path-to-repo>`:

```bash
mkdir -p .github/workflows && cp <path-to>/claude-readonly.yml .github/workflows/
```

On Windows (PowerShell): `New-Item -ItemType Directory -Force .github\workflows; Copy-Item <path-to>\claude-readonly.yml .github\workflows\`

You should see: `.github/workflows/claude-readonly.yml`. Commit it to the default branch, since GitHub runs `workflow_dispatch` only from there.

**2. Install the app and add the secret.** Install the Claude GitHub App on that repo. Add `ANTHROPIC_API_KEY` under Settings → Secrets and variables → Actions.

You should see: the secret listed by name, its value hidden.

**3. Run it by hand.** In the Actions tab, pick "Claude read-only summary", then "Run workflow". Or run `gh workflow run claude-readonly.yml`.

You should see: a green run, with the README summary and the TODO file list in the action's step log.

**4. Ask for a write.** Change the prompt to "Create a file named notes.txt", commit, and run it again.

You should see: no new file. Edit, Write and Bash were removed, so Claude can't write files.

## Common mistakes

| Mistake | Reality |
|---|---|
| `-p` waits at a permission prompt | It denies the call and goes on |
| `--allowedTools` limits Claude to those tools | It only pre-approves them. Remove tools with `--disallowedTools` or `--tools`. |
| An unapproved `.mcp.json` server won't start in CI | `-p` connects it without asking |
| "Read-only" in the prompt keeps the run read-only | That's advisory. Removing write tools is enforced. |

**Remember:**

- `-p` reads a prompt and stdin, prints text or JSON, and exits non-zero on failure.
- With no human, a call that would prompt is denied, so decide every tool in advance.
- A checked-out repo's hooks and `.mcp.json` servers run in `-p` unless you shut them out.
- Give the workflow the fewest GitHub permissions and tools that do the job.

Test yourself with the [quiz](quiz.md): 9 questions.

## Sources

- Headless mode: https://code.claude.com/docs/en/headless
- CLI reference: https://code.claude.com/docs/en/cli-reference#cli-flags
- Permission modes: https://code.claude.com/docs/en/permission-modes#which-mode-a-session-starts-in
- Permissions and `-p`: https://code.claude.com/docs/en/permissions#what-runs-before-you-trust-a-folder
- MCP project scope: https://code.claude.com/docs/en/mcp#project-scope
- Glob and Grep: https://code.claude.com/docs/en/tools-reference#glob-tool-behavior
- GitHub Actions: https://code.claude.com/docs/en/github-actions
- Action FAQ (`id-token: write`): https://github.com/anthropics/claude-code-action/blob/main/docs/faq.md
- GitHub `workflow_dispatch`: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_dispatch
