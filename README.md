# Claude Code under the hood

By the end of this course, you'll know what an AI coding agent does with every request, and you'll have built your own hooks, skills, subagent, MCP server and plugin for Claude Code.

```
START (once)  Host loads CLAUDE.md, memory, settings
              Host connects MCP servers → tools/list
                         ↓
PROMPT        Your text → context
                         ↓
         ┌──▶ MODEL reasons ──── done? ──▶ FINAL ANSWER
         │         ↓ needs action
         │    MODEL requests tool {name, args}
         │         ↓
         │    HOST checks: hook → rules → mode → ask you
         │         ↓
         │    HOST runs it: built-in (Bash, Read)
         │                  or MCP: tools/call → server
         │         ↓
         └─── Result → context
```

The model only requests. The host does everything else.

## Who it's for

Anyone who uses an AI coding agent, or is about to, and wants to know how it works inside. You don't need to know how AI works. If you can open a terminal and run a command, you can follow every step.

You need [Claude Code](https://code.claude.com/docs/en/overview), a [Claude subscription](https://claude.com/pricing) or [Anthropic Console](https://platform.claude.com/) account (or a supported [third-party provider](https://code.claude.com/docs/en/third-party-integrations)), and [Node.js](https://nodejs.org) LTS (v22 or later). No server needed.

## What you'll learn

- What the model does, what the host does, and what happens on every tool call
- How settings, context and permissions shape what the agent can see and do
- How to extend Claude Code with hooks, skills, subagents and plugins
- How MCP works, and how to build, connect and secure your own MCP server
- Which controls actually hold when the agent is fed hostile text

## Learning path

| # | Chapter | Level | Time | Lab | Quiz | Status |
|---|---|---|---|---|---|---|
| 00 | [Foundations](chapters/00-foundations/README.md) | Beginner | 3 min | — | [Quiz](https://hourki.github.io/claude-code-under-the-hood/00-foundations/quiz/) | ✅ Verified |
| 01 | [Runtime lifecycle](chapters/01-runtime-lifecycle/README.md) | Beginner | 4 min | — | [Quiz](https://hourki.github.io/claude-code-under-the-hood/01-runtime-lifecycle/quiz/) | ✅ Verified |
| 02 | [Settings and defaults](chapters/02-settings-and-defaults/README.md) | Beginner | 7 min | In the chapter | [Quiz](https://hourki.github.io/claude-code-under-the-hood/02-settings-and-defaults/quiz/) | ✅ Verified |
| 03 | [Context engineering](chapters/03-context-engineering/README.md) | Beginner | 5 min | — | [Quiz](https://hourki.github.io/claude-code-under-the-hood/03-context-engineering/quiz/) | ✅ Verified |
| 04 | [Permissions](chapters/04-permissions/README.md) | Intermediate | 5 min | In the chapter | [Quiz](https://hourki.github.io/claude-code-under-the-hood/04-permissions/quiz/) | ✅ Verified |
| 05 | [Hooks](chapters/05-hooks-hands-on/README.md) | Intermediate | 5 min | [hooks](labs/hooks) | [Quiz](https://hourki.github.io/claude-code-under-the-hood/05-hooks-hands-on/quiz/) | ✅ Verified |
| 06 | [Skills and plugins](chapters/06-skills-and-plugins/README.md) | Intermediate | 5 min | [readme-tools](labs/readme-tools) | [Quiz](https://hourki.github.io/claude-code-under-the-hood/06-skills-and-plugins/quiz/) | ✅ Verified |
| 07 | [Subagents](chapters/07-subagents/README.md) | Intermediate | 6 min | [subagents](labs/subagents) | [Quiz](https://hourki.github.io/claude-code-under-the-hood/07-subagents/quiz/) | ✅ Verified |
| 08 | [MCP fundamentals](chapters/08-mcp-fundamentals/README.md) | Intermediate | 6 min | [notes-mcp](labs/notes-mcp) | [Quiz](https://hourki.github.io/claude-code-under-the-hood/08-mcp-fundamentals/quiz/) | ✅ Verified |
| 09 | [Build an MCP server](chapters/09-build-an-mcp-server/README.md) | Hands-on | 6 min | [notes-mcp](labs/notes-mcp) | [Quiz](https://hourki.github.io/claude-code-under-the-hood/09-build-an-mcp-server/quiz/) | ✅ Verified |
| 10 | [Control layers](chapters/10-control-layers/README.md) | Intermediate | 4 min | — | [Quiz](https://hourki.github.io/claude-code-under-the-hood/10-control-layers/quiz/) | ✅ Verified |
| 11 | [MCP security](chapters/11-mcp-security/README.md) | Hands-on | 7 min | [notes-mcp](labs/notes-mcp) | [Quiz](https://hourki.github.io/claude-code-under-the-hood/11-mcp-security/quiz/) | ✅ Verified |
| 12 | [Capstone: one plugin](chapters/12-capstone-plugin/README.md) | Hands-on | 4 min | [notes-mcp](labs/notes-mcp) | [Quiz](https://hourki.github.io/claude-code-under-the-hood/12-capstone-plugin/quiz/) | ✅ Verified |
| 13 | [Build your own harness](chapters/13-build-your-own-harness/README.md) | Hands-on | 7 min | [mini-harness](labs/mini-harness) | [Quiz](https://hourki.github.io/claude-code-under-the-hood/13-build-your-own-harness/quiz/) | 🚧 Draft |
| 14 | [Agents in CI/CD](chapters/14-agents-in-ci-cd/README.md) | Intermediate | 5 min | [ci-agent](labs/ci-agent) | [Quiz](https://hourki.github.io/claude-code-under-the-hood/14-agents-in-ci-cd/quiz/) | 🚧 Draft |
| 15 | [Agents in production](chapters/15-agents-in-production/README.md) | Hands-on | 7 min | [readonly-infra](labs/readonly-infra) | [Quiz](https://hourki.github.io/claude-code-under-the-hood/15-agents-in-production/quiz/) | 🚧 Draft |
| 16 | [Leaving your agent running](chapters/16-leaving-your-agent-running/README.md) | Intermediate | 5 min | In the chapter | [Quiz](https://hourki.github.io/claude-code-under-the-hood/16-leaving-your-agent-running/quiz/) | 🚧 Draft |

✅ Verified: every claim checked against the official docs (see [Accuracy](chapters/README.md#accuracy)). 🚧 Draft: not fully checked yet. Steps inside a Claude session were checked by reading, not by running them.

Time is the reading only. Hands-on steps take longer.

## Quick start

```bash
git clone https://github.com/hourki/claude-code-under-the-hood.git
cd claude-code-under-the-hood
claude doctor
```

`claude doctor` checks your Claude Code install and changes nothing. Then open [Chapter 00](chapters/00-foundations/README.md).

## How to use this repo

1. Read the chapters in order. Each one builds only on the chapters before it.
2. Do the lab or hands-on steps where a chapter has them. Each step says what you should see.
3. Take the chapter's quiz before you move on.

## More

- **Site with clickable quizzes:** https://hourki.github.io/claude-code-under-the-hood/. On GitHub, a quiz file shows its answers, so try the site first.
- **Contributing:** found a mistake or an outdated fact? Open an issue or a pull request. To preview the site, run `python3 -m venv .venv`, `.venv/bin/pip install -r requirements-docs.txt` and `.venv/bin/properdocs serve -f mkdocs.yml`.
- **Accuracy:** see [Accuracy](chapters/README.md#accuracy).
- **License:** [MIT](LICENSE)
