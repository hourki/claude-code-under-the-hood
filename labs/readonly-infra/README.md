# readonly-infra lab

A settings file and a `PreToolUse` hook for a read-only infrastructure agent, used in [Chapter 15](../../chapters/15-agents-in-production/README.md). They block commands that change a cluster or a cloud account. Nothing here talks to a cluster or a cloud.

## Run it

From `labs/readonly-infra`:

```bash
npm ci
npm run build
npm test
```

You should see: `ℹ pass 5` and `ℹ fail 0`.

Then feed the hook a sample call. No Claude session needed:

```bash
node dist/block-writes.js < samples/blocked-kubectl-delete.json
```

You should see: a JSON reply with `"permissionDecision":"deny"`. On Windows (PowerShell), use `Get-Content samples\blocked-kubectl-delete.json | node dist\block-writes.js`.

## Files

| File | Role |
|---|---|
| `settings.json` | Deny rules for the file tools and for write commands, bypass mode off, and the hook entry. Replace `<path-to-repo>` before you use it. |
| `src/block-writes.ts` | `PreToolUse` hook: denies Bash commands that change infrastructure |
| `src/writes.ts` | The check itself: `kubectl`, `terraform`, `helm` and `aws` write words |
| `src/writes.test.ts` | Tests (`npm test`): every rule, read commands, every sample, bad input, `settings.json` |
| `samples/blocked-*.json` | Hook inputs that must be denied |
| `samples/allowed-*.json` | Hook inputs that must get no answer |

`npm run lint` type-checks the code without building it.
