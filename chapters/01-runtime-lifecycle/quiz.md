# 01 — Quiz: runtime lifecycle

Answer each question first. Scored questions check themselves; open questions have a model answer to open.

## Part 1 — Open questions

**1.** Put these in order:

- a) result added to context
- b) `PreToolUse` hook runs
- c) model requests a tool
- d) host loads `CLAUDE.md`
- e) model writes the final answer
- f) MCP client sends `tools/call`

<details markdown="1"><summary>Answer</summary>

**d, c, b, f, a, e** — init first, then the model requests, the host checks (hook), the host routes to the server, the result enters context, the model answers.

</details>

<quiz>
**2.** Model, host, or MCP server?

- a) decides to run `npm test`: [[model]]
- b) runs it: [[host]]
- c) calls the GitHub REST API: [[MCP server]]
- d) enforces a deny rule: [[host]]
- e) turns the tool request into JSON-RPC: [[host]]

---
- a) **model** — it decides and requests.
- b) **host** — it executes built-in tools like Bash.
- c) **MCP server** — the GitHub MCP server calls GitHub's API.
- d) **host** — enforcement lives outside the model.
- e) **host** — its MCP client builds the `tools/call` message.
</quiz>

<quiz>
**3.** True or false: "Every time Claude uses a GitHub MCP tool, the server first sends the full tool list."

- [ ] True
- [x] False

**False.** `tools/list` runs at connect (or from cache, on `list_changed`, or on reconnect). Each use is only `tools/call` → result. `name` and `arguments` are separate fields in that call.
</quiz>

**4.** You connected a GitHub MCP server with 80 tools, but they take up almost no context. Why? What happens when one tool is needed?

<details markdown="1"><summary>Answer</summary>

**Tool search.** The host discovered all 80 tools, but the model sees only their names. When it needs one, it calls `ToolSearch` to load that one schema, then calls the tool.

</details>

**5.** How do `Read config.yaml` and a GitHub MCP call differ?

<details markdown="1"><summary>Answer</summary>

- **Same:** the model requests, hooks and rules apply, the result goes into context.
- **Different:** a built-in runs inside the host and is always loaded (never deferred). For MCP, the host sends JSON-RPC `tools/call` over a transport and **the server executes**.

</details>

**6.** You have a deny rule `Bash(git push --force:*)`. Claude reasons: "the user wants it fixed, force-push the branch." What happens?

<details markdown="1"><summary>Answer</summary>

**Blocked by the host.** Reasoning can't change it: enforcement is outside the model. The denial goes back to the model, so it can try another approach.
Side note: an *ask* rule triggers a permission prompt, not a hook.

</details>

**7.** Your MCP server moves from stdio to HTTP. What changes? What stays?

<details markdown="1"><summary>Answer</summary>

- **Changes:** how messages travel (local process + pipes vs URL, network, TLS, auth) and the config (`command` vs `type: http` + `url`).
- **Stays:** the JSON-RPC messages, tool names, results, and what the model sees.

</details>

**8.** `npm start` fails with "PAYMENTS_DB_URL is not set". Then Claude calls a GitHub tool instead of answering. Why?

<details markdown="1"><summary>Answer</summary>

**The agent loop.** The result entered context, the model reasoned again, and it still needed the root cause. The final answer goes to you, not to the host.

</details>

**9.** You said "never touch prod" in chat. After auto-compaction, Claude seems to forget it. Why? Give two fixes.

<details markdown="1"><summary>Answer</summary>

**Compaction summarized the chat-only instruction.** It is not a hallucination.

- **Fix 1:** put it in the root `CLAUDE.md`. It is reloaded after compaction (advisory).
- **Fix 2:** a deny rule or a `PreToolUse` hook (enforced).
- **Strongest:** credentials with no prod access.

</details>

**10.** The nightly backup job fails. Claude reads `backup.tf`, uses an AWS MCP tool, runs `aws s3 ls`, then answers. For each step, say who runs it, which controls apply, and where the result goes.

<details markdown="1"><summary>Answer</summary>

| Step | Who / controls | Result |
|---|---|---|
| Read `backup.tf` | Host runs it. Hook + rules apply. | Content enters context (uses tokens). |
| AWS MCP tool | Model loads the schema via `ToolSearch`, then requests. Host checks (likely a prompt), sends `tools/call`. **Server executes.** | Result → context. No `tools/list` here: discovery already happened. |
| Bash `aws s3 ls` | Hook → rules → mode → prompt. Sandbox if enabled. | Output → context. |
| Answer | Model writes it, host displays it. | Context keeps growing; compaction near the limit. |

</details>

## Part 2 — Retest (multiple choice)

<quiz>
**1.** The GitHub server connected at start. Claude calls its tools 4 times. The tools didn't change. How many `tools/list` requests happen during those 4 calls?

- [ ] a) 4
- [ ] b) 1
- [x] c) 0
- [ ] d) 8

**c** — discovery happened at connect. Each use is only `tools/call`.
</quiz>

<quiz>
**2.** Tool search is on. Only `list_buckets`' name is in context. What happens first?

- [ ] a) the host sends `tools/list`
- [x] b) the model calls `ToolSearch`; the host loads that schema from what it already discovered
- [ ] c) the model calls the tool without a schema
- [ ] d) the server pushes the schema

**b** — the host already has every schema from discovery. `ToolSearch` only loads one into context.
</quiz>

<quiz>
**3.** You ran `claude mcp add --transport stdio db -- npx -y @bytebase/dbhub --dsn ...`. Who connects to PostgreSQL?

- [ ] a) the Claude Code process
- [ ] b) the model
- [ ] c) a Bytebase cloud service
- [x] d) the DBHub process on your laptop, started by Claude Code

**d** — a stdio server is a separate local process. It holds the DB connection and executes the queries.
</quiz>

<quiz>
**4.** A built-in `Read` on a 400-line file. Does the result use context?

- [x] a) yes, every tool result does
- [ ] b) no, built-ins are free
- [ ] c) only MCP results do
- [ ] d) only above 10,000 tokens

**a** — every tool result enters the context.
</quiz>

<quiz>
**5.** You read a file 20 minutes ago. No compaction since. Is it still in context?

- [ ] a) no
- [ ] b) only a summary
- [x] c) yes, until compaction or session end
- [ ] d) only if re-read

**c** — results stay in context until compaction or the end of the session.
</quiz>

<!-- mkdocs-quiz results -->
