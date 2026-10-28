// PreToolUse hook: blocks Bash commands that change infrastructure, before they run.
// It only reads the command text. It never runs it.
import { readFileSync } from "node:fs";
import { findWrite } from "./writes.js";

type HookInput = { tool_name?: string; tool_input?: { command?: string } };

let input: HookInput;
try {
  input = JSON.parse(readFileSync(0, "utf8")) as HookInput;
} catch {
  // Fail closed: if we can't read the call, block it. Exit code 2 = block, stderr = the reason.
  console.error("block-writes: could not read the hook input, so the call is blocked.");
  process.exit(2);
}

const reason = input.tool_name === "Bash" ? findWrite(input.tool_input?.command ?? "") : null;
if (reason) {
  const decision = { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason };
  console.log(JSON.stringify({ hookSpecificOutput: decision }));
}
// No output means no decision: the deny rules and the permission mode decide.
