# 01 — Quiz: runtime lifecycle

Pick an answer. The quiz checks it and shows the explanation.

## Part 1

<quiz>
**1.** Put these steps in order:

1. result added to context
2. `PreToolUse` hook runs
3. model requests a tool
4. host loads `CLAUDE.md`
5. model writes the final answer
6. MCP client sends `tools/call`

- [ ] a) 3, 4, 2, 6, 1, 5
- [ ] b) 4, 3, 6, 2, 1, 5
- [x] c) 4, 3, 2, 6, 1, 5
- [ ] d) 4, 2, 3, 6, 5, 1

**c** — init first (4), then the model requests (3), the host checks (hook, 2), the host routes to the server (6), the result enters context (1), the model answers (5).
</quiz>

<quiz>
**2.** Model, host, or MCP server? Who does each of these?

1. decides to run `npm test`
2. runs it
3. calls the GitHub REST API
4. enforces a deny rule
5. turns the tool request into JSON-RPC

- [x] a) model, host, MCP server, host, host
- [ ] b) model, host, host, model, MCP server
- [ ] c) host, host, MCP server, model, host
- [ ] d) model, MCP server, MCP server, host, model

**a**

1. **model** — it decides and requests.
2. **host** — it executes built-in tools like Bash.
3. **MCP server** — the GitHub MCP server calls GitHub's API.
4. **host** — enforcement lives outside the model.
5. **host** — its MCP client builds the `tools/call` message.
</quiz>

<quiz>
**3.** True or false: "Every time Claude uses a GitHub MCP tool, the server first sends the full tool list."

- [ ] True
- [x] False

**False.** `tools/list` runs at connect (or from cache, on `list_changed`, or on reconnect). Each use is only `tools/call` → result. `name` and `arguments` are separate fields in that call.
</quiz>

<quiz>
**4.** You connected a GitHub MCP server with 80 tools, but they take up almost no context. Why? What happens when one tool is needed?

- [ ] a) the host never discovered them: it fetches each schema from GitHub on first use
- [x] b) tool search: the model sees only the names, then calls `ToolSearch` to load the one schema it needs
- [ ] c) the server compresses its schemas, and the model calls the tool directly
- [ ] d) the host sends `tools/list` again each time a tool is needed

**b** — **tool search.** The host discovered all 80 tools, but the model sees only their names. When it needs one, it calls `ToolSearch` to load that one schema, then calls the tool.
</quiz>

<quiz>
**5.** How do `Read config.yaml` and a GitHub MCP call differ?

- [ ] a) they don't: the host executes both
- [ ] b) hooks and permission rules apply only to the built-in
- [ ] c) only the MCP result goes into context
- [x] d) for MCP, the host sends JSON-RPC `tools/call` and the server executes. Everything else is the same

**d**

- **Same:** the model requests, hooks and rules apply, the result goes into context.
- **Different:** a built-in runs inside the host. For MCP, the host sends JSON-RPC `tools/call` over a transport and **the server executes**.
</quiz>

<quiz>
**6.** You have a deny rule `Bash(git push --force:*)`. Claude reasons: "the user wants it fixed, force-push the branch." What happens?

- [ ] a) it runs: the reasoning shows the user wants it
- [ ] b) you get a permission prompt
- [x] c) the host blocks it, and the denial goes back to the model
- [ ] d) the session ends

**c** — **blocked by the host.** Reasoning can't change it: enforcement is outside the model. The denial goes back to the model, so it can try another approach.
Side note: an *ask* rule triggers a permission prompt, not a hook.
</quiz>

<quiz>
**7.** Your MCP server moves from stdio to HTTP. What changes? What stays?

- [x] a) how messages travel and the config change. The JSON-RPC messages, tool names, results and what the model sees stay
- [ ] b) the JSON-RPC messages and tool names change. The config stays
- [ ] c) everything changes, including what the model sees
- [ ] d) nothing changes, not even the config

**a**

- **Changes:** how messages travel (local process + pipes vs URL, network, TLS, auth) and the config (`command` vs `type: http` + `url`).
- **Stays:** the JSON-RPC messages, tool names, results, and what the model sees.
</quiz>

<quiz>
**8.** `npm start` fails with "PAYMENTS_DB_URL is not set". Then Claude calls a GitHub tool instead of answering. Why?

- [ ] a) the host ran the GitHub tool on its own after the error
- [x] b) the agent loop: the result entered context, the model reasoned again, and it still needed the root cause
- [ ] c) the error ended the turn and a new one started
- [ ] d) the model hallucinated a tool call

**b** — **the agent loop.** The result entered context, the model reasoned again, and it still needed the root cause. The final answer goes to you, not to the host.
</quiz>

<quiz>
**9.** You said "never touch prod" in chat. After auto-compaction, Claude seems to forget it. Why, and what fixes it?

- [ ] a) the model hallucinated. Repeat the instruction more often
- [ ] b) the session expired. Restart Claude Code
- [ ] c) the instruction never reached the model. Send it again in chat
- [x] d) compaction summarized the chat-only instruction. Put it in the root `CLAUDE.md`, or enforce it with a deny rule or a `PreToolUse` hook

**d** — **compaction summarized the chat-only instruction.** It is not a hallucination.

- **Fix 1:** put it in the root `CLAUDE.md`. It is reloaded after compaction (advisory).
- **Fix 2:** a deny rule or a `PreToolUse` hook (enforced).
- **Strongest:** credentials with no prod access.
</quiz>

<quiz>
**10.** The nightly backup job fails. Claude reads `backup.tf`, uses an AWS MCP tool, runs `aws s3 ls`, then answers. Which description of who runs each step, which controls apply, and where the results go is right?

- [ ] a) the model runs `aws s3 ls` itself, and only the MCP result enters context
- [ ] b) the host sends `tools/list` before the AWS MCP call, then executes the AWS tool itself
- [x] c) the host runs `Read` and `aws s3 ls` after its checks, the AWS MCP server executes its tool after the host sends `tools/call`, and every result enters context
- [ ] d) hooks and rules apply only to the Bash step

**c**

| Step | Who / controls | Result |
|---|---|---|
| Read `backup.tf` | Host runs it. Hook + rules apply. | Content enters context (uses tokens). |
| AWS MCP tool | Model loads the schema via `ToolSearch`, then requests. Host checks (likely a prompt), sends `tools/call`. **Server executes.** | Result → context. No `tools/list` here: discovery already happened. |
| Bash `aws s3 ls` | Hook → rules → mode → prompt. Sandbox if enabled. | Output → context. |
| Answer | Model writes it, host displays it. | Context keeps growing; compaction near the limit. |
</quiz>

## Part 2 — Retest

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
