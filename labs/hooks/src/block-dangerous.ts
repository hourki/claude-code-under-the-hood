// PreToolUse hook: blocks `rm -rf` and `git push --force` before they run.
// Claude Code sends the tool call as JSON on stdin. A deny goes back as JSON on stdout.
import { readFileSync } from "node:fs";
import { findDanger } from "./danger.js";

type HookInput = { tool_name?: string; tool_input?: { command?: string } };

let input: HookInput;
try {
  input = JSON.parse(readFileSync(0, "utf8")) as HookInput;
} catch {
  // Fail closed: if we can't read the call, block it. Exit code 2 = block, stderr = the reason.
  console.error("block-dangerous: could not read the hook input, so the call is blocked.");
  process.exit(2);
}

const reason = input.tool_name === "Bash" ? findDanger(input.tool_input?.command ?? "") : null;
if (reason) {
  const decision = { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason };
  console.log(JSON.stringify({ hookSpecificOutput: decision }));
}
// No output means no decision: the normal permission flow carries on.
