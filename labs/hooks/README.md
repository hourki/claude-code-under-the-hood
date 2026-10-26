# hooks lab

Two Claude Code hooks in TypeScript, used in [Chapter 05](../../chapters/05-hooks-hands-on/README.md). One blocks dangerous commands, the other logs every tool call.

## Run it

From `labs/hooks`:

```bash
npm install
npm run build
npm test
```

You should see: `ℹ pass 3` and `ℹ fail 0`.

Then feed the hook a sample call. No Claude session needed:

```bash
node dist/block-dangerous.js < samples/rm-rf.json
```

You should see: a JSON reply with `"permissionDecision":"deny"`. On Windows (PowerShell), use `Get-Content samples\rm-rf.json | node dist\block-dangerous.js`.

## Files

| File | Role |
|---|---|
| `src/block-dangerous.ts` | `PreToolUse` hook: denies `rm -rf` and `git push --force` |
| `src/danger.ts` | The check itself, kept separate so it can be tested |
| `src/log-tool-use.ts` | `PostToolUse` hook: appends one line per tool call to `tool-log.txt` |
| `src/print-settings.ts` | Prints a `hooks` block for `.claude/settings.json`, with your real paths |
| `src/danger.test.ts` | Tests (`npm test`) |
| `samples/*.json` | Sample hook inputs to pipe in |

`npm run lint` type-checks the code without building it.
