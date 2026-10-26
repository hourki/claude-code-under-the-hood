# 07 — Quiz: subagents

Pick an answer. The quiz checks it and shows the explanation.

<quiz>
**1.** You spend 20 minutes describing a bug, then ask a subagent to "check the logs". Its report misses the point. Why?

- [ ] a) subagents use weaker models
- [x] b) it never saw your conversation, only the short task message
- [ ] c) it can't read files
- [ ] d) its context was compacted

**b** — a subagent starts fresh. Put the facts it needs into the task.
</quiz>

<quiz>
**2.** Mid-session, you create the first file in a new `.claude/agents/` folder. Claude says it doesn't know that subagent. What fixes it?

- [ ] a) rename the file
- [x] b) restart the session once
- [ ] c) add `model: inherit`
- [ ] d) run `/compact`

**b** — Claude Code only notices a brand-new `agents` folder at startup. Later edits apply within seconds.
</quiz>

<quiz>
**3.** You want every report from a subagent to be 10 lines or fewer. Where does that rule go?

- [ ] a) `maxTurns: 10`
- [ ] b) `tools: Read`
- [x] c) the subagent's prompt, with an exact reply format
- [ ] d) a permission rule

**c** — no field caps report length. `maxTurns` caps turns, not lines.
</quiz>

<quiz>
**4.** The main session runs in `acceptEdits`. A subagent's file sets `permissionMode: default`. Which mode does the subagent use?

- [x] a) `acceptEdits`: that main-session mode overrides the subagent's
- [ ] b) `default`: the file always wins
- [ ] c) `plan`
- [ ] d) `bypassPermissions`

**a** — `bypassPermissions`, `acceptEdits` and `auto` in the main session override a subagent's own mode.
</quiz>

<quiz>
**5.** You have three steps that each edit the same file, in order. Agent team, parallel subagents, or the main conversation?

- [ ] a) an agent team
- [ ] b) three parallel subagents
- [x] c) the main conversation
- [ ] d) a fork per step

**c** — teams and parallel subagents suit independent jobs. Sequential edits to one file belong in one place.
</quiz>

<!-- mkdocs-quiz results -->
