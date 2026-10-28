# Agent instructions

Rules for coding agents (Claude Code, Codex, Cursor, Copilot and others) working in this repository. This file is canonical: `CLAUDE.md` only imports it.

The repo is a beginner course on how AI coding agents work inside, built around Claude Code. A reader goes through the chapters in order, runs the labs, and takes the quizzes. Every change must keep that path easy to follow.

## Repository map

| Path | Contents |
|---|---|
| `chapters/NN-slug/README.md` | One lesson per chapter |
| `chapters/NN-slug/quiz.md` | That chapter's quiz (mkdocs-quiz syntax) |
| `chapters/README.md` | The Learning path page, also the site's home page |
| `labs/hooks/` | Two TypeScript hooks (Chapter 05) |
| `labs/readme-tools/` | A one-skill plugin (Chapter 06) |
| `labs/subagents/` | Synthetic logs and a subagent (Chapter 07) |
| `labs/notes-mcp/` | The notes MCP server (Chapters 08, 09, 11), also the `notes-kit` plugin (Chapter 12) |
| `labs/mini-harness/` | A tiny Agent SDK host with one read-only tool (Chapter 13) |
| `labs/ci-agent/` | A read-only GitHub Actions workflow to copy into your own repo (Chapter 14) |
| `labs/readonly-infra/` | Settings and a `PreToolUse` hook for a read-only infra agent (Chapter 15) |
| `mkdocs.yml` | The site: ProperDocs + MaterialX + mkdocs-quiz, `docs_dir: chapters` |
| `.github/workflows/docs.yml` | Builds the site with `properdocs build --strict` and deploys it to GitHub Pages |

## Gates

A change is done only when every gate it touches passes.

| What changed | Run | Expect |
|---|---|---|
| `labs/hooks` | `npm install`, `npm run lint`, `npm run build`, `npm test` | `ℹ pass 3`, `ℹ fail 0` |
| `labs/notes-mcp` | `npm install`, `npm run lint`, `npm run build`, `npm test` | `ℹ pass 4`, `ℹ fail 0` |
| `labs/mini-harness` | `npm install`, `npm run lint`, `npm run build`, `npm test` | `ℹ pass 2`, `ℹ fail 0` |
| `labs/readonly-infra` | `npm install`, `npm run lint`, `npm run build`, `npm test` | `ℹ pass 5`, `ℹ fail 0` |
| Anything under `chapters/` or `mkdocs.yml` | `.venv/bin/properdocs build --strict -f mkdocs.yml` | Zero warnings |

Set up the docs tools once with `python3 -m venv .venv` and `.venv/bin/pip install -r requirements-docs.txt`.

Never run `npm audit fix`, bump dependencies or add a package unless asked.

## Learning path rules

The chapter order must satisfy all of these:

1. **Concept before use.** No chapter uses a term, tool or idea that an earlier chapter hasn't introduced.
2. **References point backwards.** Every "Chapter NN" mention and every link to another chapter points to an earlier one. If a later chapter covers something in depth, give a one-line definition instead of a forward link.
3. **Gradual difficulty.** Beginner → Intermediate → Hands-on, never a jump of more than one level between neighbors. No two heavy chapters (6 minutes of reading or more) back to back.
4. **Early win.** The reader builds or runs something within the first 3 chapters.
5. **Understand, build, secure, ship.** The site nav groups chapters in that order, and the capstone comes last.
6. **One question per chapter.** Propose a split or a merge instead of letting a chapter cover two big topics.

## Chapter format

Every lesson keeps this shape, in this order:

1. `# NN — Title`
2. `**In short:**` in two lines
3. `**You'll learn:**` with three bullets
4. The body: a concrete example first, then the explanation
5. `**Remember:**` with 3 to 5 takeaways
6. `Test yourself with the [quiz](quiz.md): N questions.`
7. `## Sources`: a list of the official pages the chapter was checked against. The check date and the "trust the docs" note live only in the Accuracy section of `chapters/README.md`.

Hands-on steps are bold and numbered, and each one says "You should see:" with the expected result. Where a command differs by OS, give macOS / Linux and Windows (PowerShell) versions.

Link to other chapters with relative paths (`../04-permissions/README.md`). Link to lab files with absolute GitHub URLs, because `labs/` is outside the site.

Reading time is the words outside code blocks divided by 200, rounded.

## Writing rules

- Plain words, "you", active voice. Show a short concrete example before you explain it.
- Three sentences per paragraph at most. A beginner should never need to read a section twice.
- Define every term in plain words the first time it appears in the course.
- Explain each concept once in the whole repo. Later mentions get one line and a link back.
- Cut filler, recaps ("as we saw earlier"), marketing tone, emoji, heavy bold, and stock phrases like "it's important to note", "delve", "leverage", "seamless" and "robust".
- US spelling.
- Facts that change between releases (defaults, version numbers, limits) say "As of <month year>" and link to the official docs.

## Quizzes

- Syntax: a `<quiz>` block with options as `- [ ]` and the correct one as `- [x]`, then the explanation. Fill-in questions use `[[answer]]` and a `---` line before the explanation. Open questions use `<details markdown="1"><summary>Answer</summary>`. Each file ends with `<!-- mkdocs-quiz results -->`.
- Never change a correct answer. Rewording a question for clarity is fine.
- A question may only test its own chapter or earlier ones.
- When you add or remove a question, update the count in the lesson's "Test yourself" line.

## Lab code rules

- TypeScript, ES modules, `strict`, with no unused locals or parameters. `npm run lint` is `tsc --noEmit`.
- The simplest code that works: plain functions and plain objects, functions of 20 lines or fewer, nesting of 2 levels or less. No classes, generics tricks, chained ternaries or extra error-handling layers.
- Dependencies: the official MCP SDK packages and `zod` in `notes-mcp`, `@anthropic-ai/claude-agent-sdk` and `zod` in `mini-harness`, plus `typescript` and `@types/node` as dev dependencies. Nothing else.
- Comments explain why, briefly. A known limit gets `// shortcut: <the limit>`.
- A stdio MCP server writes logs to stderr only. stdout carries the protocol.
- Labs write only inside their own folder. `notes.json` and `tool-log.txt` are gitignored.
- Each lab README runs the lab in 3 commands or fewer and says what you should see.

**Contract with the chapters.** Chapters and quizzes rely on these, so keep them working exactly as described:

- the tool names, inputs and outputs `add_note`, `list_notes`, `search_notes`, `delete_note`, the resource `notes://all` and the prompt `summarize_notes`
- the output of `npm run list` and `npm run demo`, quoted in Chapters 08 and 09
- the deny messages of `block-dangerous` and `guard-delete`, and the test counts above

Every code snippet in a chapter must match its lab file. Indentation may differ and `...` marks a cut, but every other line is copied as is. When you change a lab file, update the snippets that quote it.

## Renaming, reordering or adding a chapter

Update all of these in the same change:

1. The folder name and the `# NN —` heading of its `README.md` and `quiz.md`
2. The `nav` in `mkdocs.yml`
3. The table in `chapters/README.md` (Level, Time, Needs)
4. The table in the root `README.md`, including the quiz URLs on the site
5. Every relative link and "Chapter NN" mention in chapters, quizzes, lab READMEs and code comments

Then check the learning path rules again and run the strict docs build.

## Public repository

This repo is public. Never add:

- usernames, home folder paths, personal emails, tokens or keys
- internal hostnames, real IP addresses, or client and company names
- output copied from a real machine, like `/status` or a real settings file

Use placeholders instead: `<path-to-repo>`, `<token>`, `test@example.com`, `API_KEY=fake`. Sample data is synthetic, so the logs name clients like `worker-12`, not IPs.

## Git

Don't stage, commit or push unless the maintainer asks. The maintainer reviews and commits every change.
