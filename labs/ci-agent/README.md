# ci-agent lab

A GitHub Actions workflow that runs Claude Code on a read-only task, used in [Chapter 14](../../chapters/14-agents-in-ci-cd/README.md). It summarizes `README.md` and lists the files that contain TODO. It runs only when you start it by hand, and Claude can't edit files or run shell commands.

No npm here. The file is meant for a repository of your own, not this one.

## Run it

1. Install the [Claude GitHub App](https://github.com/apps/claude) on your repo, and add a repository secret named `ANTHROPIC_API_KEY` (Settings → Secrets and variables → Actions).
2. Copy the workflow into your repo, then commit it to the default branch:

   ```bash
   mkdir -p .github/workflows && cp claude-readonly.yml <path-to-repo>/.github/workflows/
   ```

   On Windows (PowerShell): `Copy-Item claude-readonly.yml <path-to-repo>\.github\workflows\` (create the folder first if it's missing).

3. Start it from the Actions tab ("Claude read-only summary", then "Run workflow"), or with `gh workflow run claude-readonly.yml`.

You should see: a green run. The `anthropics/claude-code-action` step log holds five bullets about your README and the list of files that contain TODO.

## Line by line

| Line | Why |
|---|---|
| `on: workflow_dispatch:` | Manual runs only. No push, PR or schedule starts it. |
| `permissions: contents: read` | The job's GitHub token can read the code and nothing else |
| `id-token: write` | Lets the action get a GitHub OIDC token, which it needs to work as the Claude GitHub App |
| `timeout-minutes: 10` | Stops a runaway job |
| `actions/checkout@<sha> # v7.0.1` | Puts the repo on the runner so Claude can read it. A full commit SHA can't be moved like a tag. |
| `persist-credentials: false` | Doesn't leave the GitHub token in the checkout's git config |
| `anthropics/claude-code-action@<sha> # v1.0.264` | The Claude Code GitHub Action, pinned the same way |
| `anthropic_api_key:` | The secret you added. Never paste the key itself. |
| `prompt:` | The task. With a prompt, the action runs right away instead of waiting for `@claude`. |
| `--allowedTools "Read,Glob,Grep"` | Pre-approves the three read tools, and brings Glob and Grep back on Linux runners |
| `--disallowedTools "Bash,Edit,Write"` | Removes the shell and the write tools, whatever the prompt or the repo's settings say |
| `--max-turns 5` | Caps the agentic turns. Claude Code exits with an error at the cap. |

## Files

| File | Role |
|---|---|
| `claude-readonly.yml` | The workflow to copy into `.github/workflows/` of your own repo |
