# mini-harness lab

A tiny agent host built on the Claude Agent SDK, used in [Chapter 13](../../chapters/13-build-your-own-harness/README.md). It asks one question, gives Claude one read-only tool, and prints every message of the agent loop.

## Run it

From `labs/mini-harness`, test the tool first. No API call:

```bash
npm install
npm run build
npm test
```

You should see: `ℹ pass 2` and `ℹ fail 0`.

Then set an API key from the [Claude Console](https://platform.claude.com/) and run the harness. This call is billed to your API account:

```bash
export ANTHROPIC_API_KEY=<your-api-key>
npm start
```

On Windows (PowerShell), use `$env:ANTHROPIC_API_KEY = "<your-api-key>"`, then `npm start`.

You should see: one line per message, in this order: `[system/init]`, `[assistant]` with a `tool_use`, `[user]` with a `tool_result`, `[assistant]` with text, and `[result/success]` with the answer. Other lines, like status events, may appear in between.

Ask your own question with `npm start -- "Which services are healthy?"`.

## Files

| File | Role |
|---|---|
| `src/main.ts` | The harness: the tool, the in-process MCP server, the `query()` options and the message printer |
| `src/inventory.ts` | The tool's logic: looks up one service in `data/services.json` |
| `src/inventory.test.ts` | Tests (`npm test`), with no API call |
| `data/services.json` | Synthetic service inventory the tool reads |

`npm run lint` type-checks the code without building it. Don't install with `--omit=optional`: the SDK gets its Claude Code binary from an optional dependency.
