// PostToolUse hook: appends one line per successful tool call to tool-log.txt in this folder.
// It only observes. PostToolUse runs after the tool, so it can't block or undo anything.
import { appendFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const LOG_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "tool-log.txt");

const input = JSON.parse(readFileSync(0, "utf8")) as { tool_name?: string; tool_input?: { command?: unknown } };
const detail = typeof input.tool_input?.command === "string" ? input.tool_input.command : "";
appendFileSync(LOG_FILE, `${new Date().toISOString()} ${input.tool_name ?? "?"} ${detail}\n`);
