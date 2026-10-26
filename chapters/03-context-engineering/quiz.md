# 03 — Quiz: context engineering

Pick an answer. The quiz checks it and shows the explanation.

## Set A

<quiz>
**1.** Which is loaded IN FULL at session start?

- [ ] a) every skill body
- [x] b) root `CLAUDE.md`
- [ ] c) every MCP tool schema
- [ ] d) all path-scoped rules

**b** — skills and MCP tools load only a label at start. Path-scoped rules wait for a matching file.
</quiz>

<quiz>
**2.** Where does a 40-step weekly release procedure belong?

- [ ] a) root `CLAUDE.md`
- [ ] b) `MEMORY.md`
- [x] c) a skill
- [ ] d) a path-scoped rule

**c** — a skill. Only its name and description load at start. The 40 steps load when you invoke it.
</quiz>

<quiz>
**3.** You said "staging is eu-west-3" in chat 3 hours ago. After compaction, Claude forgot it. Best fix?

- [ ] a) repeat it
- [ ] b) a path-scoped rule
- [x] c) root `CLAUDE.md`
- [ ] d) raise `MAX_MCP_OUTPUT_TOKENS`

**c** — root `CLAUDE.md` is re-injected from disk after compaction. Repeating it in chat can be lost again.
</quiz>

<quiz>
**4.** What happens to a path-scoped rule for `migrations/**` after compaction?

- [ ] a) reloaded immediately
- [x] b) summarized away; reloads on the next matching read
- [ ] c) gone for the rest of the session
- [ ] d) saved to memory

**b** — it comes back when Claude reads a file under `migrations/` again.
</quiz>

<quiz>
**5.** What does a subagent see at start?

- [ ] a) your full conversation
- [ ] b) nothing, not even `CLAUDE.md`
- [ ] c) the last tool result
- [x] d) the task message + standard material like `CLAUDE.md`

**d** — a fresh window with the task and standard material. Not your conversation. (The built-in Explore and Plan subagents even skip `CLAUDE.md`.)
</quiz>

<quiz>
**6.** A subagent reads 40 files and returns a 6,000-token report. What does it cost the main context?

- [x] a) ~6,000 tokens
- [ ] b) zero
- [ ] c) all 40 files
- [ ] d) nothing until compaction

**a** — the 40 files stay in the subagent's window. Only the report lands in yours.
</quiz>

<quiz>
**7.** What does a `PreToolUse` hook cost in context?

- [ ] a) the script is loaded at start
- [x] b) zero, unless it outputs content that gets added
- [ ] c) it loads with skills
- [ ] d) it is summarized at compaction

**b** — a hook is code outside the model. Only context it adds to the conversation costs tokens.
</quiz>

<quiz>
**8.** Claude must NEVER run `terraform destroy` in prod. Where do you put that?

- [ ] a) `CLAUDE.md`
- [ ] b) a skill
- [ ] c) `MEMORY.md`
- [x] d) a `PreToolUse` hook or a deny rule

**d** — the other three are advisory context. Only a hook or a deny rule is enforced.
</quiz>

<quiz>
**9.** When should you run `/compact` manually?

- [ ] a) mid-debugging at 50%
- [ ] b) after every tool call
- [x] c) between tasks
- [ ] d) never

**c** — between tasks. Mid-task, you may lose details you still need.
</quiz>

<quiz>
**10.** You have 100 skills of ~3,000 tokens each. What is the startup cost?

- [ ] a) ~300,000 tokens
- [x] b) names + descriptions only
- [ ] c) nothing
- [ ] d) the last used skill

**b** — label upfront, body on demand.
</quiz>

## Set B

<quiz>
**1.** You read 25 config files an hour ago. Answers are now slower and less sharp. Why?

- [ ] a) `CLAUDE.md` grows
- [x] b) the config files are still in context
- [ ] c) skills reload
- [ ] d) MCP re-runs `tools/list`

**b** — tool results stay in context until compaction. `/compact` or a subagent would have helped.
</quiz>

<quiz>
**2.** Which costs context every session, even if unused?

- [ ] a) a 2,000-token skill body
- [ ] b) a path-scoped rule
- [x] c) a 500-line root `CLAUDE.md`
- [ ] d) subagent work

**c** — root `CLAUDE.md` loads in full at every start.
</quiz>

<quiz>
**3.** Your `CLAUDE.md` is 600 lines and its rules get ignored. Fix?

- [ ] a) split it with `@imports`
- [ ] b) write rules in CAPITALS
- [ ] c) move it to `MEMORY.md`
- [x] d) keep it under ~200 lines; procedures → skills; file rules → path-scoped rules

**d** — `@imports` still load in full, so (a) changes nothing.
</quiz>

<quiz>
**4.** `CLAUDE.md` contains `@docs/runbook.md` (2,000 lines). What happens?

- [x] a) it loads in full every session
- [ ] b) it loads when relevant
- [ ] c) the first 200 lines load
- [ ] d) it is never loaded

**a** — `@imports` are not lazy.
</quiz>

<quiz>
**5.** `MEMORY.md` is 400 lines. What loads at start?

- [ ] a) all of it
- [ ] b) nothing
- [x] c) the first 200 lines or 25KB
- [ ] d) topic files only

**c** — keep `MEMORY.md` a short index. Topic files load on demand.
</quiz>

<quiz>
**6.** You spend 30 minutes explaining a bug, then ask a subagent to "look into the logs". The result is generic. Why?

- [ ] a) it uses a weaker model
- [x] b) it never saw your conversation, only the vague task
- [ ] c) it can't read files
- [ ] d) it was compacted

**b** — put the facts it needs into the task message.
</quiz>

<quiz>
**7.** What is most likely missing after compaction?

- [x] a) a chat-only instruction
- [ ] b) a root `CLAUDE.md` rule
- [ ] c) an unscoped rule
- [ ] d) the `MEMORY.md` index

**a** — the other three are reloaded from disk.
</quiz>

<quiz>
**8.** A hook that runs after every edit prints a 3,000-line lint report. Context cost?

- [ ] a) zero
- [ ] b) the script, once
- [ ] c) the first edit only
- [x] d) the output is added each time, so it grows fast

**d** — hooks are free only when they add nothing. Print a short summary instead.
</quiz>

<quiz>
**9.** Migration rules that apply only to `migrations/`. Where?

- [ ] a) root `CLAUDE.md`
- [x] b) a path-scoped rule
- [ ] c) a deny rule
- [ ] d) a subagent

**b** — it loads only when Claude reads a matching file.
</quiz>

<quiz>
**10.** You need to scan 50 log files and keep the main context clean. Best approach?

- [ ] a) the main session reads them all
- [ ] b) `/compact`, then read them
- [x] c) a subagent with "return only the root cause in 5 lines"
- [ ] d) paste the logs into `CLAUDE.md`

**c** — the noise stays in the subagent. A strict return format keeps the summary small.
</quiz>

<!-- mkdocs-quiz results -->
