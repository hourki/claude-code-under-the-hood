# Accuracy review (2026-10-27)

Temporary file: delete before merging.

Every factual claim in chapters 00–12 was checked against the official Claude Code docs (https://code.claude.com/docs/en/) and the MCP spec 2026-07-28 (https://modelcontextprotocol.io/specification/2026-07-28). Totals: 319 ✅ verified, 39 ❌ wrong (fixed), 6 ⚠️ unverifiable (removed or reworded as uncertain). Hands-on steps that need a live Claude session (for example `/context` totals and the subagent panel) were checked by reading only.

| Chapter | Claim | Status | Doc link | Fix applied |
|---|---|---|---|---|
| 00 | Model only writes text and tool requests, the host runs tools | ✅ verified | https://code.claude.com/docs/en/how-claude-code-works | — |
| 00 | Built-in tools include `Read` and `Bash`, not MCP | ✅ verified | https://code.claude.com/docs/en/tools-reference | — |
| 00 | MCP messages use JSON-RPC 2.0 | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/basic | — |
| 00 | MCP server: local over stdio or remote over HTTP | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/basic/transports | — |
| 00 | Plugin bundles skills, hooks, subagents, MCP servers (MCP optional) | ✅ verified | https://code.claude.com/docs/en/features-overview | — |
| 00 | Skill = instructions loaded when relevant | ✅ verified | https://code.claude.com/docs/en/features-overview | — |
| 00 | `PreToolUse` hook runs right before a tool runs | ✅ verified | https://code.claude.com/docs/en/hooks | — |
| 00 | Subagent has its own fresh context window | ✅ verified | https://code.claude.com/docs/en/sub-agents#what-loads-at-startup | — |
| 00 | Memory = files like `CLAUDE.md` loaded into later sessions, no training | ✅ verified | https://code.claude.com/docs/en/memory | — |
| 00 | Host runs in a terminal, an IDE or the cloud | ✅ verified | https://code.claude.com/docs/en/overview | — |
| 00 | Permission system: rules and modes allow, ask or deny | ✅ verified | https://code.claude.com/docs/en/permissions | — |
| 00 | Diagram labels the model box "Anthropic servers" | ✅ verified | https://code.claude.com/docs/en/model-config#default-model-setting | — (simplified: Bedrock, Agent Platform, Foundry also serve models) |
| 00 | Quiz Q1–Q3 answers match the chapter | ✅ verified | https://code.claude.com/docs/en/features-overview | — |
| 01 | Start: host loads `CLAUDE.md`, memory, settings, then `tools/list` per server | ✅ verified | https://code.claude.com/docs/en/mcp#failed-discovery-requests | — |
| 01 | Check order: `PreToolUse` hook, then rules, then mode, then prompt | ✅ verified | https://code.claude.com/docs/en/permissions#precedence-among-rules-hooks-and-mods | — |
| 01 | Rules are enforced by Claude Code, not the model | ✅ verified | https://code.claude.com/docs/en/permissions#manage-permissions | — |
| 01 | A denied call returns to the model so it can try another way | ✅ verified | https://code.claude.com/docs/en/permission-modes#how-auto-mode-evaluates-actions | — |
| 01 | Compaction near the limit; `CLAUDE.md` reloaded; chat-only instructions can be lost | ✅ verified | https://code.claude.com/docs/en/how-claude-code-works#when-context-fills-up | — |
| 01 | `tools/list` at connect, again on `list_changed` or reconnect | ✅ verified | https://code.claude.com/docs/en/mcp#dynamic-tool-updates | — |
| 01 | Tool search on by default; model sees MCP tool names; `ToolSearch` loads a schema | ✅ verified | https://code.claude.com/docs/en/mcp#scale-with-mcp-tool-search | — |
| 01 | "Built-in tools are always loaded" | ❌ wrong | https://code.claude.com/docs/en/changelog | Changed to "Some built-in tools, like `WebFetch`, are deferred the same way" (doc: "deferred tools (WebSearch, WebFetch, etc.)") |
| 01 | `tools/call` JSON-RPC shape with `name` and `arguments` | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/server/tools | — |
| 01 | `mcp__<server>__<tool>` is Claude Code's naming | ✅ verified | https://code.claude.com/docs/en/permissions#mcp | — |
| 01 | `tool_use` block has `name` and `input` | ❌ wrong | https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls | Added the missing `id` field (doc example: `"type": "tool_use", "id": "toolu_…", "name": …, "input": …`) |
| 01 | Claude picks tools from your prompt, no routing table | ✅ verified | https://code.claude.com/docs/en/how-claude-code-works | — |
| 01 | `Bash(gh *)` deny rule syntax | ✅ verified | https://code.claude.com/docs/en/permissions#wildcard-patterns | — |
| 01 | Quiz Q3: discovery can come from a cache | ✅ verified | https://code.claude.com/docs/en/mcp#server-status-detail | — |
| 01 | Quiz Q5: built-in "always loaded (never deferred)" | ❌ wrong | https://code.claude.com/docs/en/changelog | Removed the parenthetical (doc: "deferred tools (WebSearch, WebFetch, etc.)") |
| 01 | Quiz Q6: `Bash(git push --force:*)` is valid (`:*` at the end) | ✅ verified | https://code.claude.com/docs/en/permissions#wildcard-patterns | — |
| 01 | Quiz Q7: stdio `command` vs `type: http` + `url` | ✅ verified | https://code.claude.com/docs/en/mcp#add-a-server-from-an-mcpservers-json-block | — |
| 01 | Retest Q3: `claude mcp add --transport stdio db -- npx -y @bytebase/dbhub --dsn` | ✅ verified | https://code.claude.com/docs/en/mcp#example-query-your-postgresql-database | — |
| 01 | Results stay in context until compaction or session end | ✅ verified | https://code.claude.com/docs/en/context-window#what-survives-compaction | — |
| 02 | `$schema` URL for settings | ✅ verified | https://code.claude.com/docs/en/settings#edit-a-settings-file | — |
| 02 | Settings read at start, most edits applied live | ✅ verified | https://code.claude.com/docs/en/settings#when-edits-take-effect | — |
| 02 | "`cat .env` isn't covered by `Read` rules" | ❌ wrong | https://code.claude.com/docs/en/permissions#read-and-edit | Changed to "file tools or Bash commands like `cat .env`. A script that opens the file itself isn't covered" (doc: "apply … to file commands Claude Code recognizes in Bash, such as `cat`") |
| 02 | Four scopes, their files, who they affect, commit or not | ✅ verified | https://code.claude.com/docs/en/settings#settings-files-and-who-they-affect | — |
| 02 | `~/.claude` = `%USERPROFILE%\.claude` on Windows | ✅ verified | https://code.claude.com/docs/en/settings#find-or-create-your-settings-files | — |
| 02 | Managed settings from a system file or admin console | ✅ verified | https://code.claude.com/docs/en/settings#check-what-your-organization-enforces | — |
| 02 | User file appears when you first change any `/config` option | ❌ wrong | https://code.claude.com/docs/en/settings#find-or-create-your-settings-files | Changed to "an option like the theme" (doc: "A few `/config` options, including Show tips, save to `.claude/settings.local.json`") |
| 02 | Local file appears on first "Yes, and don't ask again" | ✅ verified | https://code.claude.com/docs/en/settings#find-or-create-your-settings-files | — |
| 02 | `~/.claude.json`: account, MCP servers, trust; not for settings keys | ✅ verified | https://code.claude.com/docs/en/settings-reference#global-config-settings | — |
| 02 | Precedence: managed, `--settings`, local, project, user | ✅ verified | https://code.claude.com/docs/en/settings#settings-precedence | — |
| 02 | `spinnerTipsEnabled` key exists, any file | ✅ verified | https://code.claude.com/docs/en/settings-reference#spinnertipsenabled | — |
| 02 | Lists merge; a deny anywhere beats an allow | ✅ verified | https://code.claude.com/docs/en/settings#lists-merge-instead-of-overriding | — |
| 02 | `ANTHROPIC_MODEL` beats `model` from any file | ✅ verified | https://code.claude.com/docs/en/settings#settings-precedence | — |
| 02 | "Some keys only work from your user file" | ❌ wrong | https://code.claude.com/docs/en/settings#a-value-you-set-is-ignored | Changed to "ignored in project files … works only from your user or managed settings" (doc: "set them in user or managed settings instead") |
| 02 | Project allow rules wait for trust; deny/ask apply right away | ✅ verified | https://code.claude.com/docs/en/settings#a-committed-key-doesnt-reach-teammates | — |
| 02 | Default mode `auto` in terminal/VS Code, `default` for `-p` and SDK | ✅ verified | https://code.claude.com/docs/en/permission-modes#which-mode-a-session-starts-in | — |
| 02 | Auto mode safety check "reviews each action" | ❌ wrong | https://code.claude.com/docs/en/permission-modes#how-auto-mode-evaluates-actions | Changed to "reviews actions before they run" (doc: "Read-only actions and file edits in your working directory are auto-approved") |
| 02 | Default model: Opus 5.5 on most plans and providers | ✅ verified | https://code.claude.com/docs/en/model-config#default-model-setting | — |
| 02 | Auto memory on; start of `MEMORY.md` loads | ✅ verified | https://code.claude.com/docs/en/memory#enable-or-disable-auto-memory | — |
| 02 | Sandbox off by default | ✅ verified | https://code.claude.com/docs/en/settings-reference#sandbox-enabled | — |
| 02 | MCP tool search on by default | ✅ verified | https://code.claude.com/docs/en/mcp#configure-tool-search | — |
| 02 | Commit attribution adds `Co-Authored-By` by default | ✅ verified | https://code.claude.com/docs/en/settings-reference#attribution-commit | — |
| 02 | `/status` shows version, model, account, `Setting sources` | ✅ verified | https://code.claude.com/docs/en/settings#confirm-what-loaded | — |
| 02 | `/context` shows usage and loaded `CLAUDE.md` files | ✅ verified | https://code.claude.com/docs/en/context-window#check-your-own-session | — |
| 02 | `/hooks` lists hooks and their source | ✅ verified | https://code.claude.com/docs/en/hooks#the-%2Fhooks-menu | — |
| 02 | `claude doctor`: terminal, read-only, install + settings errors | ✅ verified | https://code.claude.com/docs/en/cli-reference | — (also in `claude --help`, v2.1.311) |
| 02 | `/permissions` lists rules with their file, can add/remove | ✅ verified | https://code.claude.com/docs/en/permissions#manage-permissions | — |
| 02 | `/model`: Enter saves default, `s` this session only | ✅ verified | https://code.claude.com/docs/en/commands | — |
| 02 | `/config` changes options; `/mcp` reconnect/enable/disable | ✅ verified | https://code.claude.com/docs/en/commands | — |
| 02 | No command shows which file set a key | ✅ verified | https://code.claude.com/docs/en/settings#confirm-what-loaded | — |
| 02 | `--settings` applies one session, writes nothing | ✅ verified | https://code.claude.com/docs/en/settings#change-a-setting-for-one-session | — |
| 02 | Strict JSON; a comment gives a Settings Error | ✅ verified | https://code.claude.com/docs/en/settings#fix-a-broken-settings-file | — |
| 02 | `model` read only at start | ✅ verified | https://code.claude.com/docs/en/settings#when-edits-take-effect | — |
| 02 | `claude --safe-mode` starts with customizations off | ✅ verified | https://code.claude.com/docs/en/debug-your-config | — |
| 02 | `env` values plain text, reach subprocesses; use `apiKeyHelper` | ✅ verified | https://code.claude.com/docs/en/settings-reference#env | — |
| 02 | Local file kept out of git only if Claude Code created it | ✅ verified | https://code.claude.com/docs/en/settings#keep-personal-settings-out-of-a-repository | — |
| 02 | Hands-on commands (bash + PowerShell, cleanup) run as written | ✅ verified | — | — (dry-checked by reading) |
| 02 | Quiz Q1–Q5 answers match the docs | ✅ verified | https://code.claude.com/docs/en/settings | — |
| 03 | "stays fast and sharp" | ⚠️ unverifiable | https://code.claude.com/docs/en/best-practices#what-you-can-stop-doing | Changed to "stays focused" (doc: "a focused context gets you better answers and costs less") |
| 03 | "When it fills up, answers get slower and less sharp" | ⚠️ unverifiable | https://code.claude.com/docs/en/best-practices#what-you-can-stop-doing | Changed to "A focused context gets you better answers and costs less" (same quote) |
| 03 | Start: system prompt, tool defs, `CLAUDE.md`, unscoped rules, skill descriptions, MCP names | ✅ verified | https://code.claude.com/docs/en/context-window#what-the-timeline-shows | — |
| 03 | Root and parent-folder `CLAUDE.md` load at launch | ✅ verified | https://code.claude.com/docs/en/memory#how-claude-md-files-load | — |
| 03 | First 200 lines or 25KB of `MEMORY.md`; topic files on demand | ✅ verified | https://code.claude.com/docs/en/memory#how-it-works | — |
| 03 | Path rules and subfolder `CLAUDE.md` load "when Claude reads" a file | ❌ wrong | https://code.claude.com/docs/en/memory#path-specific-rules | Changed to "reads or edits" (doc: "when Claude uses the Read, Write, or Edit tool on a matching file") |
| 03 | Hooks cost nothing unless they add text | ✅ verified | https://code.claude.com/docs/en/hooks#exit-code-0 | — |
| 03 | After compaction: root `CLAUDE.md`, unscoped rules, auto memory re-injected | ✅ verified | https://code.claude.com/docs/en/context-window#what-survives-compaction | — |
| 03 | Skill bodies re-injected, 5,000 each / 25,000 total | ✅ verified | https://code.claude.com/docs/en/context-window#what-survives-compaction | — |
| 03 | Path rules and nested `CLAUDE.md` summarized, reload on demand | ✅ verified | https://code.claude.com/docs/en/context-window#what-survives-compaction | — |
| 03 | Re-reads up to 5 recent files after compaction | ✅ verified | https://code.claude.com/docs/en/context-window#what-survives-compaction | — |
| 03 | Subagent gets task + `CLAUDE.md`, "never your conversation" | ❌ wrong | https://code.claude.com/docs/en/sub-agents#what-loads-at-startup | Added the fork exception (doc: "The exception is a fork, which inherits the parent conversation") |
| 03 | Only the subagent's summary returns to your context | ✅ verified | https://code.claude.com/docs/en/context-window#what-the-timeline-shows | — |
| 03 | Keep root `CLAUDE.md` under about 200 lines | ✅ verified | https://code.claude.com/docs/en/memory#write-effective-instructions | — |
| 03 | Rule files: any `.md` in `.claude/rules/` or `~/.claude/rules/`, `paths` frontmatter | ✅ verified | https://code.claude.com/docs/en/memory#organize-rules-with-claude%2Frules%2F | — |
| 03 | Rule without `paths` loads every session, survives compaction | ✅ verified | https://code.claude.com/docs/en/memory#set-up-rules | — |
| 03 | `@imports` load in full with `CLAUDE.md` | ✅ verified | https://code.claude.com/docs/en/memory#import-additional-files | — |
| 03 | MCP output warning > 10,000 tokens, default max 25,000 (`MAX_MCP_OUTPUT_TOKENS`) | ✅ verified | https://code.claude.com/docs/en/mcp#mcp-output-limits-and-warnings | — |
| 03 | `/context` shows usage, `/compact` compacts now, compact between tasks | ✅ verified | https://code.claude.com/docs/en/context-window#when-your-context-fills-up | — |
| 03 | "Past about 200 lines, rules get ignored" | ❌ wrong | https://code.claude.com/docs/en/memory#write-effective-instructions | Changed to "Claude follows its rules less reliably" (doc: "Longer files consume more context and reduce adherence") |
| 03 | "A hook that prints a lot adds that text every time" | ❌ wrong | https://code.claude.com/docs/en/hooks#exit-code-0 | Changed to "Text a hook sends back to Claude is added every time" (doc: "For most events, Claude Code writes stdout to the debug log") |
| 03 | Quiz A5: Explore and Plan skip `CLAUDE.md` | ✅ verified | https://code.claude.com/docs/en/sub-agents#what-loads-at-startup | — |
| 03 | Quiz B1: "slower and less sharp" | ⚠️ unverifiable | https://code.claude.com/docs/en/best-practices#what-you-can-stop-doing | Reworded to "feel less focused"; answer b unchanged |
| 03 | Quiz B8: a hook that "prints" a report fills context | ❌ wrong | https://code.claude.com/docs/en/hooks#exit-code-0 | Reworded to "sends … back to Claude"; answer d unchanged (doc: stdout goes to the debug log for most events) |
| 03 | Quiz B9: rule loads "when Claude reads" | ❌ wrong | https://code.claude.com/docs/en/memory#path-specific-rules | Changed to "reads or edits"; answer b unchanged |
| 03 | Other quiz answers (A1–A4, A6–A10, B2–B7, B10) | ✅ verified | https://code.claude.com/docs/en/context-window | — |
| 04 | Keys `allow`, `ask`, `deny`, `defaultMode` | ✅ verified | https://code.claude.com/docs/en/settings-reference#permissions | — |
| 04 | `ask` prompts even in modes that would approve | ✅ verified | https://code.claude.com/docs/en/permission-modes#actions-no-mode-auto-approves | — |
| 04 | A `Read` deny also hides files from search | ✅ verified | https://code.claude.com/docs/en/settings-reference#permissions-deny | — |
| 04 | `permissions` edits apply without restart | ✅ verified | https://code.claude.com/docs/en/settings#when-edits-take-effect | — |
| 04 | Deny, then ask, then allow; first match wins; specificity irrelevant | ✅ verified | https://code.claude.com/docs/en/permissions#manage-permissions | — |
| 04 | Local allow doesn't outrank project/managed ask | ✅ verified | https://code.claude.com/docs/en/settings#permission-rules-combine-differently-than-you-expected | — |
| 04 | `CLAUDE.md` text doesn't change what's allowed | ✅ verified | https://code.claude.com/docs/en/permissions#manage-permissions | — |
| 04 | `git log *`, `git *`, `ls *` vs `ls*`, `ls:*` | ✅ verified | https://code.claude.com/docs/en/permissions#wildcard-patterns | — |
| 04 | `Read(./.env)` matches at any depth; `//` absolute, `~/` home | ✅ verified | https://code.claude.com/docs/en/permissions#how-path-patterns-match | — |
| 04 | `WebFetch(domain:…)`, `mcp__github`, `Agent(Explore)` rules | ✅ verified | https://code.claude.com/docs/en/permissions#tool-specific-permission-rules | — |
| 04 | Compound commands: every part for allow, any part for deny/ask | ✅ verified | https://code.claude.com/docs/en/permissions#compound-commands | — |
| 04 | Wrappers stripped; `npx`, `docker exec` not | ✅ verified | https://code.claude.com/docs/en/permissions#wrappers | — |
| 04 | `Write(path)` accepted but never matches | ✅ verified | https://code.claude.com/docs/en/permissions#read-and-edit | — |
| 04 | Mode table (default/Manual, acceptEdits, plan, dontAsk, bypass) | ✅ verified | https://code.claude.com/docs/en/permission-modes#available-modes | — |
| 04 | Mode table: auto has "a safety check on each action" | ❌ wrong | https://code.claude.com/docs/en/permission-modes#available-modes | Changed to "with background safety checks" (doc row: "Everything, with background safety checks") |
| 04 | Starting mode: flag, then `defaultMode`, then built-in; Shift+Tab; `dontAsk` off cycle | ✅ verified | https://code.claude.com/docs/en/permission-modes#switch-permission-modes | — |
| 04 | Auto mode "sends each action" to the classifier | ❌ wrong | https://code.claude.com/docs/en/permission-modes#how-auto-mode-evaluates-actions | Changed to "each action your rules don't settle, other than reads and edits in your working folder" (doc: "Read-only actions and file edits in your working directory are auto-approved") |
| 04 | Classifier blocks escalation, unknown infra, hostile content; "does not guarantee safety" | ✅ verified | https://code.claude.com/docs/en/permission-modes#eliminate-permission-prompts-with-auto-mode | — |
| 04 | Bypass still obeys deny rules, ask rules still prompt | ✅ verified | https://code.claude.com/docs/en/permission-modes#actions-no-mode-auto-approves | — |
| 04 | `auto`/`bypassPermissions` default "only from `~/.claude/settings.json`" | ❌ wrong | https://code.claude.com/docs/en/settings#a-value-you-set-is-ignored | Changed to "user or managed settings" (doc: "set them in user or managed settings instead") |
| 04 | Bash rules aren't a boundary (`rm`, `git -C . push`, curl, `grep -r`, WebFetch) | ✅ verified | https://code.claude.com/docs/en/permissions#what-a-bash-rule-doesnt-match | — |
| 04 | A hook "checks what actually runs instead of how it's spelled" | ❌ wrong | https://code.claude.com/docs/en/permissions#what-a-bash-rule-doesnt-match | Sandbox limits reach; hook "checks the full command with your own logic" (doc: "To inspect the full command text … use a PreToolUse hook") |
| 04 | Step 3: Manual mode makes "every Bash command" ask | ❌ wrong | https://code.claude.com/docs/en/permissions#read-only-commands | Changed to "Bash commands that aren't read-only" (doc: read-only set runs "without a permission prompt in every mode") |
| 04 | Step 5: `cat .env` gets a prompt, a `Read` rule doesn't cover Bash | ❌ wrong | https://code.claude.com/docs/en/permissions#read-and-edit | Changed: `cat .env` is blocked too; `grep -r` or a script is the gap (doc: rules apply to "`cat`, `head`, `tail`…") |
| 04 | Steps 4 and 6: `/permissions` shows rule + file; removal applies with no restart | ✅ verified | https://code.claude.com/docs/en/permissions#manage-permissions | — |
| 04 | Quiz Q3: `cat .env` not covered by a `Read` rule | ❌ wrong | https://code.claude.com/docs/en/permissions#read-and-edit | Question now uses `grep -r API_KEY .`; answer b unchanged; explanation fixed |
| 04 | Quiz Q4: "only from `~/.claude/settings.json`" | ❌ wrong | https://code.claude.com/docs/en/settings#a-value-you-set-is-ignored | Explanation: user or managed, session starts in Manual; option c reworded, answer unchanged |
| 04 | Quiz Q1, Q2, Q5 answers | ✅ verified | https://code.claude.com/docs/en/permissions#manage-permissions | — |
| 00-04 | Internal links and anchors (incl. `#whats-on-by-default`) resolve | ✅ verified | — | — (`properdocs build --strict`: zero warnings) |
| 00-04 | No personal data (names, emails, paths, clusters) | ✅ verified | — | — |
| 05 | Hook gets tool call as JSON on stdin (`tool_name`, `tool_input`), answers JSON on stdout | ✅ verified | https://code.claude.com/docs/en/hooks#hook-lifecycle | — |
| 05 | Deny JSON shape `hookSpecificOutput.{hookEventName,permissionDecision,permissionDecisionReason}`; reason shown to Claude | ✅ verified | https://code.claude.com/docs/en/hooks#pretooluse-decision-control | — |
| 05 | Lab output of `block-dangerous.js` for `rm -rf build` matches the snippet | ✅ verified | labs/hooks (ran it) | — |
| 05 | More than 30 hook events | ✅ verified | https://code.claude.com/docs/en/hooks#hook-lifecycle | — (33 listed) |
| 05 | SessionStart: can't block, output added as context | ✅ verified | https://code.claude.com/docs/en/hooks#exit-code-0 | — |
| 05 | UserPromptSubmit can block | ✅ verified | https://code.claude.com/docs/en/hooks#exit-code-2-behavior-per-event | — |
| 05 | PreToolUse blocks via exit 2 or JSON deny | ✅ verified | https://code.claude.com/docs/en/hooks#exit-code-2-behavior-per-event | — |
| 05 | PermissionRequest can answer the prompt | ✅ verified | https://code.claude.com/docs/en/hooks#permissionrequest-decision-control | — |
| 05 | PostToolUse can't block (tool already ran) | ✅ verified | https://code.claude.com/docs/en/hooks#exit-code-2-behavior-per-event | — |
| 05 | Stop can keep Claude working | ✅ verified | https://code.claude.com/docs/en/hooks#exit-code-2-behavior-per-event | — |
| 05 | SessionEnd can't block | ✅ verified | https://code.claude.com/docs/en/hooks#exit-code-2-behavior-per-event | — |
| 05 | PreToolUse runs before permission-mode check; deny holds in bypassPermissions / --dangerously-skip-permissions (also quiz Q3) | ✅ verified | https://code.claude.com/docs/en/hooks-guide#hooks-and-permission-modes | — |
| 05 | `"async": true` runs a command hook in background | ✅ verified | https://code.claude.com/docs/en/hooks#run-hooks-in-the-background | — |
| 05 | Exit 0: JSON applied; no JSON = no decision | ✅ verified | https://code.claude.com/docs/en/hooks#exit-code-output | — |
| 05 | Exit 2: block, stderr is the reason Claude sees | ✅ verified | https://code.claude.com/docs/en/hooks#exit-code-2 | — |
| 05 | Any other exit code (e.g. 1) = non-blocking error, call goes ahead | ❌ wrong | https://code.claude.com/docs/en/hooks#exit-code-output | Added "with no valid JSON" (doc: valid JSON + other exit code = "Success. Claude Code ignores the exit code, and the fields alone decide") |
| 05 | Crashed hook, wrong path, timeout don't block | ✅ verified | https://code.claude.com/docs/en/hooks#timeouts | — |
| 05 | `"onFailure": "block"`, v2.1.295+ | ✅ verified | https://code.claude.com/docs/en/hooks#block-the-action-when-a-hook-fails | — |
| 05 | "Only exit 2 or a JSON deny blocks / exit 1 lets the call through" (Remember, Common mistakes) | ❌ wrong | https://code.claude.com/docs/en/hooks#other-exit-codes | Qualified with "by default" / "unless `onFailure` is `block`" (doc: "Exit code 1 without valid JSON output is a non-blocking error unless the hook is one whose failure blocks the action"); quiz Q1 explanation gets "by default", answer unchanged |
| 05 | Pick one style per hook: exit codes or exit 0 + JSON | ✅ verified | https://code.claude.com/docs/en/hooks#json-output | — |
| 05 | Top-level `permissionDecision` silently ignored (also quiz Q2) | ✅ verified | https://code.claude.com/docs/en/hooks-guide#fields-at-the-wrong-level | — |
| 05 | Config shape event → matcher group → handlers | ✅ verified | https://code.claude.com/docs/en/hooks#configuration | — |
| 05 | Matcher `Bash`, `Edit\|Write`, `*` = all | ✅ verified | https://code.claude.com/docs/en/hooks#matcher-patterns | — |
| 05 | Matchers are case-sensitive | ✅ verified | https://code.claude.com/docs/en/hooks-guide | — |
| 05 | `mcp__notes__.*` matches server; bare `mcp__notes` matches nothing (quiz Q5) | ✅ verified | https://code.claude.com/docs/en/hooks#match-mcp-tools | — |
| 05 | `command` + `args` = exec form, no shell, works on Windows | ✅ verified | https://code.claude.com/docs/en/hooks#exec-form-and-shell-form | — |
| 05 | Project-settings hooks wait for the trust prompt | ✅ verified | https://code.claude.com/docs/en/hooks#workspace-trust | — |
| 05 | `/hooks` is read-only and shows each hook's source | ✅ verified | https://code.claude.com/docs/en/hooks#the-%2Fhooks-menu | — |
| 05 | Hook allow can't beat deny/ask rules | ✅ verified | https://code.claude.com/docs/en/permissions#precedence-among-rules-hooks-and-mods | — |
| 05 | Several PreToolUse hooks: strictest wins | ✅ verified | https://code.claude.com/docs/en/hooks#pretooluse-decision-control | — (deny > defer > ask > allow) |
| 05 | Missing hook script → error notice in transcript, `Ctrl+O` opens transcript | ✅ verified | https://code.claude.com/docs/en/interactive-mode | — |
| 05 | Lab gate `npm install/lint/build/test` → pass 3 fail 0; `safe.json` prints nothing | ✅ verified | labs/hooks (ran it) | — |
| 05 | `print-settings` prints the registered JSON with real paths | ✅ verified | labs/hooks/src/print-settings.ts | — |
| 05 | `shortcut:` comment documents word-matching limit | ✅ verified | labs/hooks/src/danger.ts | — |
| 05 | Links: lab tree URL, permissions anchor | ✅ verified | https://code.claude.com/docs/en/permissions#precedence-among-rules-hooks-and-mods | — |
| 06 | SKILL.md snippet matches lab file | ✅ verified | labs/readme-tools/skills/readme-check/SKILL.md | — |
| 06 | Only description in context at start; full file loads on match or `/name` | ✅ verified | https://code.claude.com/docs/en/skills#control-who-invokes-a-skill | — |
| 06 | Personal / project / plugin skill paths; plugin skill as `/plugin-name:name` | ✅ verified | https://code.claude.com/docs/en/skills#choose-where-skills-load | — |
| 06 | All frontmatter fields optional, description recommended | ✅ verified | https://code.claude.com/docs/en/skills#frontmatter-reference | — |
| 06 | `name` defaults to folder name | ✅ verified | https://code.claude.com/docs/en/skills#frontmatter-reference | — |
| 06 | Put the main use case first in `description` | ✅ verified | https://code.claude.com/docs/en/skills#frontmatter-reference | — |
| 06 | `disable-model-invocation: true`: only you, description leaves context (quiz Q1) | ✅ verified | https://code.claude.com/docs/en/skills#control-who-invokes-a-skill | — |
| 06 | `user-invocable: false`: only Claude, hidden from `/` menu | ✅ verified | https://code.claude.com/docs/en/skills#frontmatter-reference | — |
| 06 | `allowed-tools` pre-approves for the turn, doesn't restrict (quiz Q4) | ✅ verified | https://code.claude.com/docs/en/skills#pre-approve-tools-for-a-skill | — |
| 06 | Invoked skill stays in conversation as one message | ✅ verified | https://code.claude.com/docs/en/skills#skill-content-lifecycle | — |
| 06 | Keep SKILL.md under 500 lines, reference in extra files | ✅ verified | https://code.claude.com/docs/en/skills#add-supporting-files | — |
| 06 | "Edits apply live: the next turn uses the new version" | ❌ wrong | https://code.claude.com/docs/en/skills#edit-a-skill-during-a-session | Changed to "Claude Code picks them up in the same session, without a restart" (doc: "picks up the change within the current session, without a restart"; lifecycle: "does not re-read the skill file on later turns") |
| 06 | plugin.json snippet and tree match lab | ✅ verified | labs/readme-tools | — |
| 06 | `agents/`, `hooks/hooks.json`, `.mcp.json` at plugin root; only plugin.json in `.claude-plugin/` | ✅ verified | https://code.claude.com/docs/en/plugins/create | — |
| 06 | `name` only required key, kebab-case, components namespaced (quiz Q2) | ✅ verified | https://code.claude.com/docs/en/plugins/manifest-reference#name | — |
| 06 | Name starting `claude-` rejected by `claude plugin validate` | ✅ verified | https://code.claude.com/docs/en/plugins/manifest-reference#name | — |
| 06 | `${CLAUDE_PLUGIN_ROOT}` = plugin's own folder | ✅ verified | https://code.claude.com/docs/en/plugins/manifest-reference | — |
| 06 | Install copies plugin folder into cache; escaping paths rejected (quiz Q3) | ✅ verified | https://code.claude.com/docs/en/plugins/loading#in-place-and-copied-plugins | — |
| 06 | Plugin `CLAUDE.md` not loaded | ✅ verified | https://code.claude.com/docs/en/plugins/components | — |
| 06 | Marketplace = `.claude-plugin/marketplace.json`; `/plugin marketplace add`, `/plugin install p@m` | ✅ verified | https://code.claude.com/docs/en/plugins/install | — (in a session, install opens the panel to pick a scope first) |
| 06 | Disable/remove from `/plugin` Installed tab | ✅ verified | https://code.claude.com/docs/en/plugins/install | — |
| 06 | Plugin runs code with your user rights; hooks/MCP outside sandbox; review hooks.json, .mcp.json, bin/ | ✅ verified | https://code.claude.com/docs/en/plugins/security#understand-what-a-plugin-can-do | — |
| 06 | Enabled plugin costs context every turn (skill/agent descriptions) (quiz Q5) | ✅ verified | https://code.claude.com/docs/en/plugins/overview | — |
| 06 | `claude plugin validate ./labs/readme-tools` → `✔ Validation passed` | ✅ verified | https://code.claude.com/docs/en/plugins/manifest-reference#validate-the-manifest | — (ran it on v2.1.311) |
| 06 | "A warning about a missing marketplace install line" | ❌ wrong | local run of `claude plugin validate` (v2.1.311) | Changed to "Notes about a missing icon or marketplace install line" (actual output: ICON_MISSING warning + install-line "Advice") |
| 06 | `--plugin-dir` loads in place, this session only | ✅ verified | https://code.claude.com/docs/en/plugins/loading#in-place-and-copied-plugins | — |
| 06 | `/context` shows skills cost | ✅ verified | https://code.claude.com/docs/en/skills#skill-descriptions-are-cut-short | — |
| 07 | log-scanner snippet matches lab file | ✅ verified | labs/subagents/.claude/agents/log-scanner.md | — |
| 07 | Lab link text names the file but URL pointed to the folder | ❌ wrong | labs/subagents | Changed to blob URL of `.claude/agents/log-scanner.md` |
| 07 | Body becomes the subagent's system prompt | ✅ verified | https://code.claude.com/docs/en/sub-agents#write-subagent-files | — |
| 07 | "No setting caps how long a report is" | ⚠️ unverifiable | https://code.claude.com/docs/en/sub-agents#frontmatter-reference | Reworded to "no subagent field caps" (frontmatter table has no length field; docs don't say no setting exists); same in Common mistakes |
| 07 | Gets own prompt + env details, task message, CLAUDE.md, git status, `skills` | ✅ verified | https://code.claude.com/docs/en/sub-agents#what-loads-at-startup | — |
| 07 | Doesn't get conversation, invoked skills, read files, output style, auto memory (quiz Q1) | ✅ verified | https://code.claude.com/docs/en/sub-agents#what-loads-at-startup | — |
| 07 | Subagent tokens count toward usage limits | ✅ verified | https://code.claude.com/docs/en/sub-agents | — |
| 07 | Fork copies whole conversation; `/subtask <task>` | ✅ verified | https://code.claude.com/docs/en/sub-agents#fork-the-current-conversation | — |
| 07 | Explore/Plan read-only, skip CLAUDE.md; general-purpose all subagent tools | ✅ verified | https://code.claude.com/docs/en/sub-agents#built-in-subagents | — |
| 07 | Only `name` and `description` required | ✅ verified | https://code.claude.com/docs/en/sub-agents#frontmatter-reference | — |
| 07 | Scope priority managed > --agents > project > user > plugin | ✅ verified | https://code.claude.com/docs/en/sub-agents#choose-the-subagent-scope | — |
| 07 | `tools` allowlist / omitted = all; `disallowedTools` applied first | ✅ verified | https://code.claude.com/docs/en/sub-agents#restrict-which-tools-a-subagent-can-use | — |
| 07 | `model` values sonnet/opus/haiku/fable/full ID/inherit | ✅ verified | https://code.claude.com/docs/en/sub-agents#frontmatter-reference | — |
| 07 | `permissionMode` unset = inherit; `maxTurns` returns partial; `skills` preloaded in full | ✅ verified | https://code.claude.com/docs/en/sub-agents#frontmatter-reference | — |
| 07 | Misspelled field ignored silently | ✅ verified | https://code.claude.com/docs/en/sub-agents#frontmatter-reference | — |
| 07 | New `agents` folder needs restart; later edits within seconds (quiz Q2) | ✅ verified | https://code.claude.com/docs/en/sub-agents#write-subagent-files | — |
| 07 | Delegation by description; "use proactively"; `@agent-<name>` guarantees | ✅ verified | https://code.claude.com/docs/en/sub-agents#invoke-subagents-explicitly | — |
| 07 | Descriptions cost context | ✅ verified | https://code.claude.com/docs/en/sub-agents#understand-automatic-delegation | — |
| 07 | Background by default (As of Oct 2026), anchor resolves | ✅ verified | https://code.claude.com/docs/en/sub-agents#which-subagents-run-in-the-background | — |
| 07 | Parallel research prompt; many reports fill context | ✅ verified | https://code.claude.com/docs/en/sub-agents#run-parallel-research | — |
| 07 | Nesting up to three layers | ✅ verified | https://code.claude.com/docs/en/sub-agents#let-subagents-spawn-their-own-subagents | — |
| 07 | 20 concurrent → `Concurrent subagent limit reached` | ✅ verified | https://code.claude.com/docs/en/sub-agents#concurrent-subagent-limit | — |
| 07 | Agent teams: shared tasks, messaging, experimental, `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`, not for sequential/same-file (quiz Q5) | ✅ verified | https://code.claude.com/docs/en/agent-teams | — |
| 07 | Inherits tools minus e.g. `AskUserQuestion`; deny rules apply | ✅ verified | https://code.claude.com/docs/en/sub-agents#available-tools | — |
| 07 | bypassPermissions/acceptEdits/auto override `permissionMode` (quiz Q4) | ✅ verified | https://code.claude.com/docs/en/sub-agents#permission-modes | — |
| 07 | `"deny": ["Agent(log-scanner)"]` disables it | ✅ verified | https://code.claude.com/docs/en/sub-agents#disable-specific-subagents | — |
| 07 | Lab: ~1,350 log lines, password failure worker→db | ✅ verified | labs/subagents/logs (1351 lines, FATAL password auth) | — |
| 07 | "a `log-scanner(...)` row while it works" | ⚠️ unverifiable | https://code.claude.com/docs/en/sub-agents#finished-subagents-in-the-panel-and-task-list | Reworded to "a row for `log-scanner` in the panel below the prompt" (doc: "subagent panel below the prompt input") |
| 07 | When to stay in main conversation vs subagent | ✅ verified | https://code.claude.com/docs/en/sub-agents#choose-between-subagents-and-main-conversation | — |
| 07 | Link to Chapter 03 anchor `#subagents-a-separate-window` | ✅ verified | ../03-context-engineering/README.md | — |
| 08 | `npm run list` output matches lab code (names, descriptions, resource title, prompt) | ✅ verified | labs/notes-mcp/src/list.ts, notes.ts (read only) | — |
| 08 | Host / client (one per server) / server roles (quiz Q1) | ✅ verified | https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture | — |
| 08 | Data layer = JSON-RPC; transport layer = how messages travel + setup + auth; same on every transport (quiz Q3) | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/basic/transports | — |
| 08 | Tools model-, resources app-, prompts user-controlled (quiz Q2) | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/server | — |
| 08 | Methods tools/list+call, resources/list+read, prompts/list+get | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/server/tools | — |
| 08 | CC: `mcp__<server>__<tool>`, `@server:uri`, `/mcp__server__prompt` or `/` menu | ✅ verified | https://code.claude.com/docs/en/mcp | — |
| 08 | Every resource has a URI; server declares capability per primitive | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/server/resources | — |
| 08 | Human should be able to deny tool calls | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/server/tools | — |
| 08 | Elicitation current; server asks user mid-call | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation | — |
| 08 | "Servers must never ask for passwords or API keys this way" (elicitation) | ❌ wrong | https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation#user-interaction-model | Changed to "in a form. They send you to a URL instead." (doc: "MUST NOT use form mode elicitation to request sensitive information … MUST use URL mode") |
| 08 | Roots, Sampling, Logging deprecated; log to stderr | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/changelog#deprecated | — |
| 08 | stdio: client launches subprocess, one message per line, logs to stderr only | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/stdio | — |
| 08 | Streamable HTTP: independent server, POST to one endpoint like `/mcp`, Origin check, bind 127.0.0.1, auth | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http | — |
| 08 | 2026-07-28 stateless, no initialize, version + capabilities in `_meta`, `server/discover` (quiz Q4) | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/changelog#major-changes | — |
| 08 | HTTP sessions removed; `MCP-Protocol-Version` header; `subscriptions/listen` | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/changelog#major-changes | — |
| 08 | 2025-11-25 and earlier = "legacy", start with initialize | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning#terminology | — |
| 08 | CC client on SDK 2.0 "asks each server which version it speaks" | ❌ wrong | https://code.claude.com/docs/en/mcp#mcp-client-runtimes | Changed to "As of October 2026, its default MCP client … asks stdio and HTTP servers whether they speak `2026-07-28`, and keeps the legacy handshake for the others" (doc: two runtimes; v2 "Asks HTTP, stdio, and claude.ai connector servers … connects to every other server as v1 does") |
| 08 | Protocol error vs tool execution error (`isError: true`); clients SHOULD pass exec errors to model (quiz Q5) | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/server/tools#error-handling | — |
| 08 | `claude mcp add --transport stdio <name> -- <cmd>`, `--transport http`, `--header`, `--scope` local default/project/user, `/mcp` | ✅ verified | https://code.claude.com/docs/en/mcp | — (also `claude mcp add --help`) |
| 08 | `npm run demo` shows `"protocolVersion": "2025-11-25"` and ends with `"isError": true` | ✅ verified | labs/notes-mcp/src/wire-demo.ts, rpc.ts, notes.ts (read only, not run) | — |
| 08 | Learn-page source links resolve | ✅ verified | https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture | — (HTTP 200) |
| 09 | Lab uses official MCP TS SDK v2 `@modelcontextprotocol/server` | ✅ verified | labs/notes-mcp/node_modules/@modelcontextprotocol/server/README.md | — |
| 09 | Node.js v22+ needed (course requirement; SDK engines `>=20`) | ✅ verified | labs/notes-mcp/node_modules/@modelcontextprotocol/server/package.json | — |
| 09 | `npm test` prints `ℹ pass 4` / `ℹ fail 0` | ✅ verified | local run of lab gate | — |
| 09 | `npm run demo` ~300 lines, starts with quoted CONNECT block | ✅ verified | local run (327 lines incl. npm header) | — |
| 09 | Demo flow diagram (initialize, initialized, 3 lists, add/read/get, delete twice, 2nd isError) | ✅ verified | local `npm run demo` output | — |
| 09 | `initialize` is the legacy (2025-era) handshake; 2026-07-28 removed it | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/changelog | — |
| 09 | `serveStdio` picks the era per client | ✅ verified | node_modules/@modelcontextprotocol/server/dist/stdio.d.mts (`legacy: 'serve'` default) | — |
| 09 | `claude mcp add --transport stdio <name> -- <cmd>`; everything after `--` is the server command | ✅ verified | https://code.claude.com/docs/en/mcp#option-3-add-a-local-stdio-server | — |
| 09 | Default scope is `local`: private, this project only | ✅ verified | https://code.claude.com/docs/en/mcp#local-scope | — |
| 09 | `claude mcp get`, `claude mcp remove`, `/mcp` status | ✅ verified | https://code.claude.com/docs/en/mcp#managing-your-servers | — |
| 09 | Tool names `mcp__notes__<tool>` | ✅ verified | https://code.claude.com/docs/en/permissions#mcp | — |
| 09 | "You get a permission prompt the first time" (add_note) | ❌ wrong | https://code.claude.com/docs/en/permission-modes#which-mode-a-session-starts-in | Scoped to Manual mode (doc: built-in start mode is "`auto` with Claude Code v2.1.283 or later"; classifier reviews instead of prompting) |
| 09 | "Tired of the prompt for read-only tools?" allow rule | ❌ wrong (mode) | https://code.claude.com/docs/en/permissions#permission-modes | Prefixed "In Manual mode" (doc: `default` "Prompts for permission on first use of each tool") |
| 09 | `@notes:notes://all` resource mention syntax | ✅ verified | https://code.claude.com/docs/en/mcp (`@server:protocol://resource/path`) | — |
| 09 | `/mcp__notes__summarize_notes` and `/notes:summarize_notes (MCP)` | ✅ verified | https://code.claude.com/docs/en/mcp (MCP prompts as commands) | — |
| 09 | Allow rule JSON `permissions.allow` with MCP tool names | ✅ verified | https://code.claude.com/docs/en/permissions#mcp | — |
| 09 | `search_notes` snippet matches lab | ✅ verified | labs/notes-mcp/src/notes.ts | — |
| 09 | zod schema becomes JSON Schema in `tools/list` | ✅ verified | local tools/list probe (`$schema` draft 2020-12) | — |
| 09 | SDK validates input before handler | ✅ verified | local probe: "Input validation error … title: Too small" | — |
| 09 | `registerResource("all-notes","notes://all")`, `registerPrompt("summarize_notes")` | ✅ verified | labs/notes-mcp/src/notes.ts | — |
| 09 | stdout reserved for JSON-RPC, logs on stderr | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/stdio | — |
| 09 | Reply `id` matches request | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/basic | — |
| 09 | Tool error → `isError: true`, model can recover | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/server/tools#error-handling | — |
| 09 | Unknown tool → JSON-RPC error `-32602`; bad input → `isError: true` | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/server/tools#error-handling + local probe | — |
| 09 | Bash sandbox doesn't cover MCP servers; server runs with your rights | ✅ verified | https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox | — |
| 09 | `http.ts` reuses `createServer()`; listens on 127.0.0.1:3333 | ✅ verified | labs/notes-mcp/src/http.ts | — |
| 09 | `claude mcp add --transport http <name> <url> --header "Authorization: Bearer …"` | ✅ verified | https://code.claude.com/docs/en/mcp#option-1-add-a-remote-http-server | — |
| 09 | curl without token → `401` | ✅ verified | SDK code: missing Origin passes, then token check returns 401 | — |
| 09 | HTTP guard snippet matches lab | ✅ verified | labs/notes-mcp/src/http.ts | — |
| 09 | Host/Origin checks stop DNS rebinding | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http | — |
| 09 | Shared server: spec's answer is OAuth 2.1 | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization | — |
| 09 | `--header` is stored in Claude Code config (`~/.claude.json`) | ✅ verified | https://code.claude.com/docs/en/mcp#local-scope | — |
| 09 | Quiz 1-5 answers | ✅ verified | same sources as above | — |
| 09 | Internal anchors `#part-1-stdio`, `#part-2-…`; GitHub lab URL | ✅ verified | headings + `git ls-tree main labs/` | — |
| 10 | CLAUDE.md, rules, skills, memory are context, not enforced | ✅ verified | https://code.claude.com/docs/en/memory#claude-md-vs-auto-memory | — |
| 10 | PreToolUse hook deny / exit 2 blocks | ✅ verified | https://code.claude.com/docs/en/hooks#exit-code-output | — |
| 10 | Rules evaluated deny → ask → allow, first match wins | ✅ verified | https://code.claude.com/docs/en/permissions#manage-permissions | — |
| 10 | Mode is the fallback; `bypassPermissions` skips prompts | ✅ verified | https://code.claude.com/docs/en/permissions#permission-modes | — |
| 10 | Hook deny holds in `bypassPermissions` | ✅ verified | https://code.claude.com/docs/en/hooks-guide#hooks-and-permission-modes | — |
| 10 | "Exit code 1 or a crash doesn't block" | ❌ wrong (incomplete) | https://code.claude.com/docs/en/hooks#block-the-action-when-a-hook-fails | Added "By default" (doc: non-blocking "unless the hook is one whose failure blocks the action", `onFailure: "block"`) |
| 10 | `Bash(aws * --profile prod*)` misses `--profile=prod` | ✅ verified | https://code.claude.com/docs/en/permissions#wildcard-patterns | — |
| 10 | Quote: "sandbox restrictions still apply even if a prompt injection bypasses…" | ✅ verified | https://code.claude.com/docs/en/permissions#how-permissions-interact-with-sandboxing | — |
| 10 | Quote: "`bypassPermissions` offers no protection against prompt injection" | ✅ verified | https://code.claude.com/docs/en/permission-modes#skip-all-checks-with-bypasspermissions-mode | Added to Sources |
| 10 | Sandbox covers "Bash only" (diagram, table, mistakes, Remember, quiz 6) | ❌ wrong | https://code.claude.com/docs/en/sandboxing | Changed to "shell commands" (doc: "limits apply to Bash, PowerShell, and Monitor commands") |
| 10 | Sandbox needs both filesystem and network limits (exfiltrate / backdoor) | ✅ verified | https://code.claude.com/docs/en/sandboxing#scope | — |
| 10 | macOS Seatbelt, nothing to install | ✅ verified | https://code.claude.com/docs/en/sandboxing#get-started | — |
| 10 | Linux/WSL2: bubblewrap + socat; "No root needed" | ❌ wrong (misleading) | https://code.claude.com/docs/en/sandboxing#set-up-linux-and-wsl2 | Changed to "which you install with your package manager" (doc install: "sudo apt-get install bubblewrap socat") |
| 10 | WSL1 and native Windows unsupported | ✅ verified | https://code.claude.com/docs/en/sandboxing | — |
| 10 | Ubuntu 24.04+ AppArmor blocks bubblewrap until profile | ✅ verified | https://code.claude.com/docs/en/sandboxing#set-up-linux-and-wsl2 | — |
| 10 | `/sandbox` saves per project; `sandbox.enabled` in `~/.claude/settings.json` | ✅ verified | https://code.claude.com/docs/en/sandboxing#get-started | — |
| 10 | Default writes: working dir, temp dir, added dirs | ✅ verified | https://code.claude.com/docs/en/sandboxing#what-the-sandbox-restricts | — |
| 10 | Default reads include `~/.ssh`, `~/.aws/credentials`; `filesystem.denyRead` | ✅ verified | https://code.claude.com/docs/en/sandboxing#what-the-sandbox-restricts | — |
| 10 | New domain "triggers a prompt in most modes" | ❌ wrong | https://code.claude.com/docs/en/sandboxing#hosts-outside-your-allowed-domains | Changed to "in Manual mode" (doc: prompt in Manual/acceptEdits/plan; auto and dontAsk refuse; bypass allows) |
| 10 | File tools, MCP servers, hooks run outside sandbox | ✅ verified | https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox | — |
| 10 | Fails open; `sandbox.failIfUnavailable: true` exits at startup | ✅ verified | https://code.claude.com/docs/en/sandboxing#get-started | — |
| 10 | Unsandboxed retry: prompt in default, silent in bypass or with allow rule; `allowUnsandboxedCommands: false` | ✅ verified | https://code.claude.com/docs/en/sandboxing#the-unsandboxed-retry-escape-hatch | — |
| 10 | `.claude/rules/` are instructions, permission rules live under `permissions` | ✅ verified | https://code.claude.com/docs/en/memory#organize-rules-with-claude-rules | — |
| 10 | Quiz 2 "only exit code 2 blocks" | ❌ wrong (incomplete) | https://code.claude.com/docs/en/hooks#block-the-action-when-a-hook-fails | Explanation now "by default"; answer unchanged |
| 10 | Quiz 3 option d "hooks tighten, they don't loosen" | ❌ wrong | https://code.claude.com/docs/en/permissions#extend-permissions-with-hooks | Reworded to "a hook's allow can't override a deny rule" (doc: hook "can … skip the prompt to let the call proceed"); still the correct option |
| 10 | Quiz 4, 5, 7, 8, 9 answers | ✅ verified | hooks-guide, permissions, sandboxing | — |
| 10 | Quiz 10: `Bash(terraform apply:*)` valid syntax | ✅ verified | https://code.claude.com/docs/en/permissions#wildcard-patterns (`:*` suffix) | — |
| 10 | Links to Ch04 `#permission-modes`, Ch05 | ✅ verified | chapter headings | — |
| 11 | Threat names: tool poisoning, shadowing, rug pull, compromised dependency | ✅ verified | https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/local-server-security | — |
| 11 | "An overreaching server" (named as the guide's term) | ❌ wrong | https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/local-server-security | Renamed "An overcollecting server" (doc: "An overcollecting server. A legitimate server that collects more than its job requires") |
| 11 | Poisoned description reaches model without a call | ✅ verified | local-server-security ("without the poisoned tool ever being invoked") | — |
| 11 | All servers share one model context | ✅ verified | local-server-security | — |
| 11 | Claude Code asks before project `.mcp.json` servers (interactive) | ✅ verified | https://code.claude.com/docs/en/mcp#project-scope | — |
| 11 | Server author "Must validate…, Should rate-limit and clean outputs" | ❌ wrong | https://modelcontextprotocol.io/specification/2026-07-28/server/tools#security-considerations | All four now "Must" (doc: "Servers MUST: … Rate limit tool invocations, Sanitize tool outputs") |
| 11 | Container/VM isolation is the strongest single fix | ✅ verified | local-server-security ("single highest-leverage mitigation") | — |
| 11 | "Claude Code doesn't filter injected text out of tool results" | ❌ wrong (incomplete) | https://code.claude.com/docs/en/permission-modes#how-auto-mode-evaluates-actions | Reworded: doesn't remove it; auto mode probe only flags (doc: "server-side probe scans incoming tool results and flags suspicious content") |
| 11 | "doesn't ask again when a server changes its tools" | ⚠️ unverifiable | https://code.claude.com/docs/en/mcp#dynamic-tool-updates | Reworded to "just fetches the new list" (doc: "Claude Code fetches the updated list from that server") |
| 11 | Quote "no system is completely immune" | ✅ verified | https://code.claude.com/docs/en/security#protect-against-prompt-injection | — |
| 11 | `claude -p`, SDK, some cloud sessions load `.mcp.json` without asking | ✅ verified | https://code.claude.com/docs/en/mcp#project-scope | — |
| 11 | stdio credentials from environment; `--env KEY=value` not shell profile | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization + local-server-security | — |
| 11 | Local HTTP: bind 127.0.0.1, Origin check required, token | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http | — |
| 11 | Authorization optional, uses OAuth 2.1 | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization | — |
| 11 | 127.0.0.1 is not an auth boundary (local programs, browser) | ✅ verified | local-server-security | — |
| 11 | Audience check; no token passthrough, own upstream token | ✅ verified | https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations | — |
| 11 | Confused deputy fixed by per-client consent | ✅ verified | authorization/security-considerations#confused-deputy-problem | — |
| 11 | Least privilege: folders, network none, own narrow token, pin version | ✅ verified | local-server-security | — |
| 11 | `npx pkg@1.2.3` pins only top-level package | ✅ verified | local-server-security ("fixes only the top-level package") | — |
| 11 | Container with no extra mounts; stdio works unchanged | ✅ verified | local-server-security | — |
| 11 | `npm run list` shows four plain descriptions | ✅ verified | local `npm run list` | — |
| 11 | `_meta` snippet matches lab; flag prompts every call, even with allow rule | ✅ verified | https://code.claude.com/docs/en/mcp#require-approval-for-a-specific-tool | — |
| 11 | Deny rule `mcp__notes__delete_note` blocks deletes | ✅ verified | https://code.claude.com/docs/en/permissions#mcp | — |
| 11 | One test proves only exact Bearer token passes | ✅ verified | labs/notes-mcp/src/notes.test.ts | — |
| 11 | stdio client and server share one trust domain | ✅ verified | local-server-security | — |
| 11 | Config allowlists are cooperative | ✅ verified | local-server-security | — |
| 11 | Anthropic doesn't security-audit or manage MCP servers | ✅ verified | https://code.claude.com/docs/en/security#mcp-security | — |
| 11 | Quiz 1-5 answers | ✅ verified | same sources | — |
| 11 | Link to Ch10 `#one-instruction-two-outcomes`, Ch09 | ✅ verified | chapter headings | — |
| 12 | `claude --plugin-dir . plugin details notes-kit` output | ✅ verified | local run (CLI 2.1.311), top block matches | — |
| 12 | Always-on cost is only the skill description | ✅ verified | local run (~82 total, notes-review ~80) | — |
| 12 | Layout `.claude-plugin/plugin.json`, `skills/`, `hooks/hooks.json` at root | ✅ verified | https://code.claude.com/docs/en/plugins/manifest-reference | — |
| 12 | Manifest and hooks.json snippets match lab | ✅ verified | labs/notes-mcp/.claude-plugin/plugin.json, hooks/hooks.json | — |
| 12 | `mcpServers` inline in manifest or `.mcp.json` at plugin root | ✅ verified | https://code.claude.com/docs/en/plugins/components#mcp-servers | — |
| 12 | `${CLAUDE_PLUGIN_ROOT}` = plugin install dir | ✅ verified | https://code.claude.com/docs/en/plugins/components#reference-plugin-paths-and-store-data | — |
| 12 | Plugin tool name `mcp__plugin_<plugin>_<server>__<tool>`; bare name never fires | ✅ verified | https://code.claude.com/docs/en/mcp#plugin-provided-mcp-servers | — |
| 12 | `hooks.json` needs outer `"hooks"` key or fails to load | ✅ verified | https://code.claude.com/docs/en/plugins/manifest-reference | — |
| 12 | Hook `command` + `args` (exec form) | ✅ verified | https://code.claude.com/docs/en/plugins/components#environment-quoting-and-matching-mcp-tools | — |
| 12 | Plugin hooks fire once the plugin loads | ✅ verified | https://code.claude.com/docs/en/plugins/components#when-plugin-hooks-fire | — |
| 12 | Skill runs as `/notes-kit:notes-review` | ✅ verified | https://code.claude.com/docs/en/plugins/create | — |
| 12 | Claude Code doesn't build plugins (no lifecycle scripts) | ✅ verified | https://code.claude.com/docs/en/plugins/loading#limits-on-the-dependency-install | — |
| 12 | `--plugin-dir` loads in place, no install step | ✅ verified | https://code.claude.com/docs/en/plugins/loading#in-place-and-copied-plugins | Added to Sources |
| 12 | ROOT changes per version; use `${CLAUDE_PLUGIN_DATA}` | ✅ verified | https://code.claude.com/docs/en/plugins/components#reference-plugin-paths-and-store-data | — |
| 12 | Name must not start with `claude-` | ✅ verified | https://code.claude.com/docs/en/plugins/manifest-reference | — |
| 12 | `claude plugin validate .` → `✔ Validation passed` | ✅ verified | local run | Added note on the new missing-icon warning seen in CLI 2.1.311 |
| 12 | `/mcp` shows `plugin:notes-kit:notes`; `/hooks` lists hooks | ✅ verified | https://code.claude.com/docs/en/plugins/components#server-names-tool-names-and-reloads, hooks#the-hooks-menu | — |
| 12 | Hook deny blocks before permission prompt | ✅ verified | https://code.claude.com/docs/en/permissions#extend-permissions-with-hooks | — |
| 12 | `delete_note` prompt shows every time (requiresUserInteraction) | ✅ verified | https://code.claude.com/docs/en/mcp#require-approval-for-a-specific-tool | — |
| 12 | Marketplace = `.claude-plugin/marketplace.json`; `/plugin install name@marketplace` | ✅ verified | https://code.claude.com/docs/en/plugins/create-marketplace, plugins/install | — |
| 12 | Quiz 5: installs copy only the plugin folder | ✅ verified | https://code.claude.com/docs/en/plugins/loading#in-place-and-copied-plugins | — |
| 12 | Quiz 1-4 answers | ✅ verified | same sources | — |
| 12 | Links to Ch05, Ch06 `#plugins`, Ch09, Ch11 `#checklist-the-notes-server`; GitHub lab URL | ✅ verified | chapter headings + `git ls-tree` | — |
| 09-12 | Personal data (names, emails, paths, clusters) | ✅ verified | grep of all 8 files | None found |
| 03 | Full conversation is sent with every request, caching makes repeats cheaper (new "Watch your token spend" section) | ✅ verified | https://code.claude.com/docs/en/costs#why-usage-climbs-in-a-long-session | — |
| 03 | `/context` shows what fills the window (new "Watch your token spend" section) | ✅ verified | https://code.claude.com/docs/en/commands | — |
| 03 | `/usage` shows session cost and plan usage limits, `/cost` is an alias (new "Watch your token spend" section) | ✅ verified | https://code.claude.com/docs/en/commands | — |
| 03 | On Pro or Max the cost figure is not the bill, watch plan usage bars (new "Watch your token spend" section) | ✅ verified | https://code.claude.com/docs/en/costs#using-the-usage-command | — |
| 03 | Root `CLAUDE.md` loads every session, even for unrelated work (new "Watch your token spend" section) | ✅ verified | https://code.claude.com/docs/en/costs#move-instructions-from-claude-md-to-skills | — |
| 03 | A subagent's own requests count toward usage (new "Watch your token spend" section) | ✅ verified | https://code.claude.com/docs/en/costs#delegate-verbose-operations-to-subagents | — |
| 03 | `/compact` reads the conversation it summarizes (new "Watch your token spend" section) | ✅ verified | https://code.claude.com/docs/en/costs#why-usage-climbs-in-a-long-session | — |
| 03 | After compaction Claude Code re-reads up to 5 recent files (new "Watch your token spend" section) | ✅ verified | https://code.claude.com/docs/en/context-window#what-survives-compaction | — |
| 03 | `/clear` costs nothing (new "Watch your token spend" section) | ✅ verified | https://code.claude.com/docs/en/costs#why-usage-climbs-in-a-long-session | — |
| 03 | Skills load only when invoked (new "Watch your token spend" section) | ✅ verified | https://code.claude.com/docs/en/costs#move-instructions-from-claude-md-to-skills | — |
