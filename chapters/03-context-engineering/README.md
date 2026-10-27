# 03 — Context engineering

**In short:** everything the agent knows right now sits in one fixed-size space, the context window.
Control what goes in, and the agent stays focused.

**You'll learn:**

- what loads into context, and when
- what survives compaction
- where to put each kind of instruction

## Two prompts, two outcomes

Say payments is broken in staging, and you ask the agent about it:

| | Prompt | Effect |
|---|---|---|
| Bad | "check everything" | Every log and config file lands in the main context. It fills up fast. |
| Good | "Use a subagent to find why the payments service crashes on start in staging. Return only the root cause and the failing file." | The noise stays in the subagent. A few lines come back. |

The context window holds your instructions, your chat and every tool result, and its size is fixed. A focused context gets you better answers and costs less. When it fills up, compaction kicks in.

## What loads, and when

| When | What |
|---|---|
| Session start, always | System prompt, built-in tool definitions, root `CLAUDE.md` (and the ones in parent folders), rules without `paths`, the first 200 lines or 25KB of `MEMORY.md`, skill names and descriptions, MCP tool names |
| On demand | A skill's full text when it runs, an MCP tool's schema via `ToolSearch`, path-scoped rules and subfolder `CLAUDE.md` files when Claude reads or edits a matching file, memory topic files |
| Grows every turn | Your prompts, the model's replies, every tool result |
| Nothing | Hooks, which run outside the model. Only text a hook adds to the conversation costs space. |

The pattern: a short label loads up front, like a skill name or a tool name. The full text loads only when the model needs it.

## What survives compaction

| Item | After compaction |
|---|---|
| Root `CLAUDE.md` and rules without `paths` | Reloaded from disk |
| Auto memory | Reloaded |
| Skills that ran | Reloaded, up to 5,000 tokens each and 25,000 in total |
| Path-scoped rules, subfolder `CLAUDE.md` | Summarized away. They come back when Claude reads a matching file again. |
| Instructions you only typed in chat | May be lost |
| The conversation, including old tool results | Summarized. Claude Code then re-reads up to 5 files it recently read or edited. |

**If it must survive, it must live in a file.**

## Subagents: a separate window

```
MAIN CONTEXT                          SUBAGENT CONTEXT (fresh)
┌──────────────────────┐   task msg   ┌───────────────────────────┐
│ your conversation    │─────────────▶│ task + CLAUDE.md          │
│                      │              │ reads 30 config files     │
│                      │              │ runs 15 commands          │
│ + summary (small)    │◀─────────────│ → writes a short summary  │
└──────────────────────┘   summary    └───────────────────────────┘
                                       (all of this is discarded)
```

A subagent gets the task message and files like `CLAUDE.md`, but not your conversation, unless it's a fork (a copy of your current conversation). Only its summary comes back, and that summary does land in your context. So write the task like a note to a new colleague who missed your 30-minute explanation.

## Where to put what

| You need | Put it in |
|---|---|
| Rules for every session | Root `CLAUDE.md`, kept under about 200 lines |
| A multi-step procedure | A skill |
| Rules for some files only | A path-scoped rule |
| A noisy investigation | A subagent |
| Something that must never happen | A hook or a deny rule. Everything else in this table is advice the model can ignore. |

## How to: a path-scoped rule

```markdown
---
paths:
  - "migrations/**"
---
# Migration rules
- Every migration needs a down step
- Never edit a migration that is already merged
```

A path-scoped rule is an instruction that loads only when Claude reads or edits a matching file. Save it as any `.md` file in `.claude/rules/`, or in `~/.claude/rules/` for all your projects. Without `paths`, the rule loads every session and survives compaction.

## Three more facts

- `@imports` in `CLAUDE.md`, like `@docs/runbook.md`, load in full with it. They aren't lazy.
- A large MCP result triggers a warning above 10,000 tokens and is capped at 25,000 by default (`MAX_MCP_OUTPUT_TOKENS`).
- `/compact` compacts now. Compact between tasks, not in the middle of one.

## Watch your token spend

Claude Code sends your full conversation with every request, so a big context costs you on every turn, not just once. Prompt caching makes the repeated part cheaper, not free.

| Run | To see |
|---|---|
| `/context` | What fills the window right now |
| `/usage` (alias `/cost`) | Your session's token usage and cost, and your plan's usage limits. On a Pro or Max plan, the cost figure isn't your bill, so watch the plan usage bars. |

What costs the most:

- **Large tool results.** They stay in context until compaction, and every later request carries them.
- **A long root `CLAUDE.md`.** It loads every session, even for unrelated work.
- **Subagents.** The summary lands in your context, and the subagent's own requests count toward your usage too.
- **Compaction.** `/compact` reads the whole conversation to summarize it, then Claude Code re-reads up to 5 recent files.

Three habits that cut spend:

1. Run `/clear` when you switch to unrelated work. It costs nothing, while compacting a large context is itself a large request.
2. Move workflow steps from `CLAUDE.md` into skills, which load only when they run.
3. Send verbose work, like test runs and log reading, to a subagent, and ask for a short answer.

## Common mistakes

| Mistake | Reality |
|---|---|
| `@imports` load only when relevant | They load in full with `CLAUDE.md`, every session. |
| Subagent work is free for the main context | Its summary lands in your context. Keep it short. |
| A long `CLAUDE.md` is safer | Past about 200 lines, Claude follows its rules less reliably. Move procedures to skills and file rules to path-scoped rules. |
| A hook's output is free | Text a hook sends back to Claude is added every time it runs. Keep it short. |

**Remember:**

- Labels load at start. Full text loads when needed.
- Every tool result stays in context until compaction.
- What must survive compaction belongs in a file.
- Send noisy work to a subagent, and ask for a short answer.

Test yourself with the [quiz](quiz.md): two sets of 10 questions.

## Sources

- Context window: https://code.claude.com/docs/en/context-window
- Memory (`CLAUDE.md`, rules, auto memory): https://code.claude.com/docs/en/memory
- Subagents (what loads at startup): https://code.claude.com/docs/en/sub-agents
- Claude Code MCP (output limits, tool search): https://code.claude.com/docs/en/mcp
- Best practices (a focused context): https://code.claude.com/docs/en/best-practices#what-you-can-stop-doing
- Hooks (which output reaches Claude): https://code.claude.com/docs/en/hooks#exit-code-0
- Manage costs (`/usage`, reducing token usage): https://code.claude.com/docs/en/costs
- Commands (`/context`, `/usage`): https://code.claude.com/docs/en/commands
