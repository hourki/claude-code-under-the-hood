# subagents lab

Sample logs and one read-only subagent, used in [Chapter 07](../../chapters/07-subagents/README.md).

## Run it

Start Claude Code from this folder, so it finds the subagent:

```bash
cd labs/subagents
claude
```

Then ask: *"Use the log-scanner subagent to find why checkout requests fail."*

You should see: a report of 10 lines or fewer that points at a password problem between the worker and the database.

## Files

| Path | Role |
|---|---|
| `logs/web.log`, `logs/worker.log`, `logs/db.log` | About 1,350 lines of made-up logs. One failure is buried in them. |
| `.claude/agents/log-scanner.md` | The subagent: read-only tools and a strict 10-line reply format |

The logs are synthetic. Every name and time in them is invented.
