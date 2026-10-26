// Plugin hook (Chapter 12): a PreToolUse hook that refuses to delete pinned notes.
// Claude Code sends the delete_note call as JSON on stdin. A deny goes back as JSON on stdout.
import { readFileSync } from "node:fs";
import { isPinned } from "./pinned.js";

const input = JSON.parse(readFileSync(0, "utf8")) as { tool_input?: { title?: string } };
const title = input.tool_input?.title ?? "";

if (isPinned(title)) {
  const reason = `"${title}" is pinned. Rename it without the "pinned" prefix first if you really want it gone.`;
  const decision = { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason };
  console.log(JSON.stringify({ hookSpecificOutput: decision }));
}
