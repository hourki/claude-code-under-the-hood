# 08 — Quiz: MCP fundamentals

Pick an answer. The quiz checks it and shows the explanation.

<quiz>
**1.** You add three MCP servers to Claude Code. How many MCP clients does the host run?

- [ ] a) one, shared by all servers
- [x] b) three: one per server connection
- [ ] c) none: the model talks to servers directly
- [ ] d) it depends on the transport

**b** — the host creates one client per server, each with its own connection.
</quiz>

<quiz>
**2.** Who decides when the `notes://all` resource is used?

- [ ] a) the model, like a tool
- [x] b) the app or you, for example by typing `@notes:notes://all`
- [ ] c) the server pushes it on every turn
- [ ] d) nobody: resources are only for logging

**b** — resources are application-controlled. Tools are the model-controlled primitive.
</quiz>

<quiz>
**3.** A server moves from stdio to Streamable HTTP. Which layer changes?

- [ ] a) the data layer: new message format
- [x] b) the transport layer: how messages travel, plus connection setup and auth
- [ ] c) both layers
- [ ] d) neither

**b** — JSON-RPC messages look the same on every transport.
</quiz>

<quiz>
**4.** A client using spec `2026-07-28` connects to a server. What replaces the old `initialize` handshake?

- [ ] a) nothing: it still sends `initialize`
- [x] b) each request carries its protocol version and capabilities in `_meta`, and the client may call `server/discover`
- [ ] c) an HTTP session ID
- [ ] d) a `ping` request

**b** — `2026-07-28` is stateless. Version info travels with every request.
</quiz>

<quiz>
**5.** Claude calls a tool with a date in the wrong format. How should the server answer?

- [ ] a) a JSON-RPC `error` object
- [x] b) a normal result with `isError: true` and a message the model can read
- [ ] c) an empty result
- [ ] d) close the connection

**b** — bad input is a tool execution error. The model can read it and try again correctly.
</quiz>

<!-- mkdocs-quiz results -->
