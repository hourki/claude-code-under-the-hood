# Learning path

A hands-on course on how AI coding agents work inside, built around Claude Code. Go in order: each chapter uses only what the chapters before it taught.

| # | Chapter | Level | Time | Needs | You'll build | Quiz |
|---|---|---|---|---|---|---|
| **Understand** | | | | | | |
| 00 | [Foundations](00-foundations/README.md) | Beginner | 3 min | — | — | [Quiz](00-foundations/quiz.md) |
| 01 | [Runtime lifecycle](01-runtime-lifecycle/README.md) | Beginner | 4 min | 00 | — | [Quiz](01-runtime-lifecycle/quiz.md) |
| 02 | [Settings and defaults](02-settings-and-defaults/README.md) | Beginner | 7 min | 01 | A project settings file you can see load | [Quiz](02-settings-and-defaults/quiz.md) |
| 03 | [Context engineering](03-context-engineering/README.md) | Beginner | 4 min | 01 | — | [Quiz](03-context-engineering/quiz.md) |
| **Build** | | | | | | |
| 04 | [Permissions](04-permissions/README.md) | Intermediate | 5 min | 02 | A deny rule you watch work | [Quiz](04-permissions/quiz.md) |
| 05 | [Hooks](05-hooks-hands-on/README.md) | Intermediate | 5 min | 04 | A hook that blocks `rm -rf`, and a logger | [Quiz](05-hooks-hands-on/quiz.md) |
| 06 | [Skills and plugins](06-skills-and-plugins/README.md) | Intermediate | 5 min | 03 | A one-skill plugin | [Quiz](06-skills-and-plugins/quiz.md) |
| 07 | [Subagents](07-subagents/README.md) | Intermediate | 6 min | 03, 04 | A log-scanning subagent | [Quiz](07-subagents/quiz.md) |
| 08 | [MCP fundamentals](08-mcp-fundamentals/README.md) | Intermediate | 6 min | 01 | A listing of a server's tools, resources and prompts | [Quiz](08-mcp-fundamentals/quiz.md) |
| 09 | [Build an MCP server](09-build-an-mcp-server/README.md) | Hands-on | 6 min | 04, 08 | The notes MCP server, over stdio and HTTP | [Quiz](09-build-an-mcp-server/quiz.md) |
| **Secure** | | | | | | |
| 10 | [Control layers](10-control-layers/README.md) | Intermediate | 4 min | 04, 05 | — | [Quiz](10-control-layers/quiz.md) |
| 11 | [MCP security](11-mcp-security/README.md) | Hands-on | 6 min | 09, 10 | A hardened notes server | [Quiz](11-mcp-security/quiz.md) |
| **Ship** | | | | | | |
| 12 | [Capstone: one plugin](12-capstone-plugin/README.md) | Hands-on | 4 min | 05, 06, 09 | The `notes-kit` plugin: server, skill and hook | [Quiz](12-capstone-plugin/quiz.md) |

"Time" is the reading only. Hands-on steps take longer.

For the hands-on parts you need [Claude Code](https://code.claude.com/docs/en/overview), a [Claude subscription](https://claude.com/pricing) or [Anthropic Console](https://platform.claude.com/) account (or a supported [third-party provider](https://code.claude.com/docs/en/third-party-integrations)), and [Node.js](https://nodejs.org) LTS (v22 or later).

## Accuracy

Every chapter was checked against the pages in its Sources section on 2026-10-27. If they disagree with a chapter, trust them.
