# 09 — Quiz: build an MCP server

Pick an answer. The quiz checks it and shows the explanation.

<quiz>
**1.** You add `console.log("debug")` to a tool handler of a stdio server. What breaks?

- [ ] a) nothing
- [x] b) the JSON-RPC stream on stdout
- [ ] c) the zod schema
- [ ] d) the permission prompt

**b** — stdout is reserved for JSON-RPC. Log to stderr with `console.error`.
</quiz>

<quiz>
**2.** Claude calls `add_note`. Which process writes `notes.json`?

- [ ] a) the model
- [ ] b) Claude Code
- [x] c) the notes server process
- [ ] d) Anthropic's servers

**c** — the server executes. The host only routes the `tools/call`.
</quiz>

<quiz>
**3.** You move the server from stdio to Streamable HTTP on localhost. What stays the same?

- [ ] a) the config in Claude Code
- [ ] b) how Claude Code starts the server
- [x] c) the JSON-RPC messages and the tools
- [ ] d) nothing

**c** — the transport and auth change. The messages and the tools don't.
</quiz>

<quiz>
**4.** Claude asks to delete a note that doesn't exist. The server replies with `isError: true`. Why is that better than crashing?

- [ ] a) it hides the problem from you
- [x] b) the model reads the error text and can recover, for example by listing notes first
- [ ] c) it retries the call automatically
- [ ] d) it turns into a JSON-RPC protocol error

**b** — a tool execution error is a normal result the model can read. A crash gives it nothing to work with.
</quiz>

<quiz>
**5.** The HTTP server binds to `127.0.0.1` and checks the `Host` and `Origin` headers. What does that protect against?

- [ ] a) a wrong bearer token
- [x] b) other machines on the network, and web pages in your browser trying to reach the server
- [ ] c) bad JSON in a request
- [ ] d) the model calling the wrong tool

**b** — `127.0.0.1` keeps it off the network. The header checks stop DNS rebinding from a browser. The token is a separate check.
</quiz>

<!-- mkdocs-quiz results -->
