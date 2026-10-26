// Prints a "hooks" block for .claude/settings.json, with this folder's absolute paths filled in.
// Copy the output into your practice folder. It never writes a file itself.
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = path.dirname(fileURLToPath(import.meta.url));
// Exec form: "command" is the program, "args" its arguments. No shell, so it works the same on Windows.
const hook = (file: string) => ({ type: "command", command: "node", args: [path.join(dist, file)] });

const settings = {
  hooks: {
    PreToolUse: [{ matcher: "Bash", hooks: [hook("block-dangerous.js")] }],
    PostToolUse: [{ matcher: "*", hooks: [{ ...hook("log-tool-use.js"), async: true }] }],
  },
};
console.log(JSON.stringify(settings, null, 2));
