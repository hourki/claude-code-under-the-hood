# 07 — Subagents and parallel work

**In short:** a subagent is a helper AI that does a noisy job in its own context window and hands back a short summary.
Use one, and your main conversation stays small and sharp.

**You'll learn:**

- what a subagent gets at the start, and what comes back
- how to write your own subagent file
- when to run several at once, and when not to

## A subagent file, first

```markdown
---
name: log-scanner
description: Scans the log files in ./logs and finds the root cause of a failure. Use it for any question about errors in these logs.
tools: Read, Glob, Grep
---

You find the root cause of failures in the log files under ./logs. You never edit files.
...
Reply in at most 10 lines, in exactly this format:
...
```

That's [`labs/subagents/.claude/agents/log-scanner.md`](https://github.com/hourki/claude-code-under-the-hood/tree/main/labs/subagents), trimmed. The frontmatter says who it is and which tools it may use. The body becomes its system prompt: the standing instructions it follows.

The strict reply format matters, because no setting caps how long a subagent's report is. Only the prompt can.

## What a subagent sees

[Chapter 03](../03-context-engineering/README.md#subagents-a-separate-window) showed the idea: a fresh window, and only a summary comes back. In detail:

| It gets | It doesn't get |
|---|---|
| Its own system prompt, plus basic details like the working directory | Your conversation |
| The task message Claude writes for it | Skills you already ran, files Claude already read |
| The `CLAUDE.md` files and a git status snapshot | Your output style and auto memory |
| Skills listed in its `skills` field | |

Everything it reads stays in its own window. Its tokens still count toward your usage limits, so it isn't free.

A fork is the exception: it starts with a copy of your whole conversation. Start one with `/subtask <task>`.

## Built-in subagents

| Name | For | Notes |
|---|---|---|
| `Explore` | Finding files and searching code | Read-only. Skips `CLAUDE.md`. |
| `Plan` | Research in plan mode | Read-only. Skips `CLAUDE.md`. |
| `general-purpose` | Multi-step tasks that may change things | Every tool available to subagents |

## Write your own

A custom subagent is a Markdown file. Only `name` and `description` are required.

| Where | Path | Wins on a name clash |
|---|---|---|
| Managed (your org) | Set by admins | 1st |
| Command line | `claude --agents '<json>'` | 2nd, this session only |
| Project | `.claude/agents/` | 3rd |
| Personal | `~/.claude/agents/` | 4th |
| Plugin | `<plugin>/agents/` | 5th |

| Field | What it does |
|---|---|
| `tools` | Allowlist. Leave it out to get every tool available to subagents. |
| `disallowedTools` | Denylist, applied first |
| `model` | `sonnet`, `opus`, `haiku`, `fable`, a full model ID, or `inherit` |
| `permissionMode` | Its own mode. Unset means it uses the main session's mode. |
| `maxTurns` | Stops after that many turns and returns a partial report |
| `skills` | Skills loaded in full at its start |

Two traps. A misspelled field is ignored without any error. And Claude Code only notices a brand-new `agents` folder after a restart, so create it before you start the session.

## How Claude picks a subagent

Claude delegates when your request matches a subagent's `description`, and words like "use proactively" make that more likely. You can also ask in plain words ("use the log-scanner subagent to..."), or type `@agent-log-scanner` to make sure that one runs.

Descriptions cost context, like skill descriptions do. Keep them short, and put the details in the body.

## Background and parallel work

As of October 2026, a subagent started from the main conversation runs in the background by default ([docs](https://code.claude.com/docs/en/sub-agents#which-subagents-run-in-the-background)). You keep working, and its report arrives in a later turn.

For independent jobs, ask for several at once: *"Research the authentication, database, and API modules in parallel using separate subagents."* Claude then combines the reports. Many long reports can still fill your context.

Subagents can start their own subagents, up to three layers deep. At 20 running at once, a new one fails with `Concurrent subagent limit reached`.

**Agent teams** go one step further: several Claude Code sessions that share a task list and message each other. They're experimental and off by default (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` turns them on). They suit research and reviews, not step-by-step work or edits to the same file.

## Permissions

A subagent inherits the main session's tools, minus a few such as `AskUserQuestion`, and your deny rules apply to it too. If the main session runs in `bypassPermissions`, `acceptEdits` or `auto`, that mode overrides the subagent's own `permissionMode`. To turn one off, deny it: `"deny": ["Agent(log-scanner)"]`.

## Hands-on: let a subagent read the logs

The lab has about 1,350 lines of made-up logs in three files, with one failure buried in them.

**1. Start in the lab folder**, so Claude Code finds the subagent:

```bash
cd labs/subagents
claude
```

**2. Take a baseline.** Run `/context` and note the total.

**3. Delegate.** Ask: *"Use the log-scanner subagent to find why checkout requests fail."*

You should see: a `log-scanner(...)` row while it works. If it runs in the background, Claude tells you and the report arrives a bit later. The report follows the 10-line format and points at a password problem between the worker and the database.

**4. Measure again.** Run `/context`.

You should see: the total grew by roughly the size of the report, not by the size of the logs.

**5. Compare (optional).** Start a new session in the same folder and ask: *"Read all three files in ./logs and find why checkout requests fail."* Run `/context` again: this time the log lines land in your own context.

**6. Try parallel (optional).** Ask: *"Use three log-scanner subagents in parallel, one per log file, then combine their findings."*

## When to skip the subagent

Stay in the main conversation for back-and-forth work, quick changes, and steps that share a lot of context. Use a subagent for noisy output, a narrower set of tools, or a job that stands on its own.

## Common mistakes

| Mistake | Reality |
|---|---|
| "It knows what we discussed" | It sees only the task message. Put the facts it needs there. |
| No reply format | Nothing caps the report's length but your prompt. |
| Expecting Claude to wait | Subagents run in the background by default. The report comes later. |
| Many parallel subagents for a sequence of steps | Parallel work suits independent jobs. Keep a sequence in one place. |

**Remember:**

- A subagent works in its own window. Only its report comes back.
- It never sees your conversation, so the task message must stand alone.
- Your prompt sets the report's length and format.
- Run several at once only for independent jobs.

Test yourself with the [quiz](quiz.md): 5 questions.

## Sources

Checked against these pages on 2026-10-26. If they disagree with this chapter, trust them.

- Subagents: https://code.claude.com/docs/en/sub-agents
- Agent teams: https://code.claude.com/docs/en/agent-teams
- Context window: https://code.claude.com/docs/en/context-window
