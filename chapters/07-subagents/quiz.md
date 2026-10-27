# 07 — Quiz: subagents

Answer each question first, then open **Answer** to check it.

**1.** You spend 20 minutes describing a bug, then ask a subagent to "check the logs". Its report misses the point. Why?

- a) subagents use weaker models
- b) it never saw your conversation, only the short task message
- c) it can't read files
- d) its context was compacted

<details markdown="1"><summary>Answer</summary>

**b** — a subagent starts fresh. Put the facts it needs into the task.

</details>

**2.** Mid-session, you create the first file in a new `.claude/agents/` folder. Claude says it doesn't know that subagent. What fixes it?

- a) rename the file
- b) restart the session once
- c) add `model: inherit`
- d) run `/compact`

<details markdown="1"><summary>Answer</summary>

**b** — Claude Code only notices a brand-new `agents` folder at startup. Later edits apply within seconds.

</details>

**3.** You want every report from a subagent to be 10 lines or fewer. Where does that rule go?

- a) `maxTurns: 10`
- b) `tools: Read`
- c) the subagent's prompt, with an exact reply format
- d) a permission rule

<details markdown="1"><summary>Answer</summary>

**c** — no field caps report length. `maxTurns` caps turns, not lines.

</details>

**4.** The main session runs in `acceptEdits`. A subagent's file sets `permissionMode: default`. Which mode does the subagent use?

- a) `acceptEdits`: that main-session mode overrides the subagent's
- b) `default`: the file always wins
- c) `plan`
- d) `bypassPermissions`

<details markdown="1"><summary>Answer</summary>

**a** — `bypassPermissions`, `acceptEdits` and `auto` in the main session override a subagent's own mode.

</details>

**5.** You have three steps that each edit the same file, in order. Agent team, parallel subagents, or the main conversation?

- a) an agent team
- b) three parallel subagents
- c) the main conversation
- d) a fork per step

<details markdown="1"><summary>Answer</summary>

**c** — teams and parallel subagents suit independent jobs. Sequential edits to one file belong in one place.

</details>
