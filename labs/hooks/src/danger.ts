// Returns a reason if a Bash command looks destructive, otherwise null.
// shortcut: plain word matching per segment; misses `bash -c "..."`, aliases and variables.
// A credential that can't delete anything is stronger, whatever the spelling.
export function findDanger(command: string): string | null {
  // Check each part of a compound command: a && b, a || b, a; b, a | b.
  for (const segment of command.split(/&&|\|\||[;|\n]/)) {
    const words = segment.trim().split(/\s+/);
    if (words[0] === "sudo") words.shift();
    const flags = words.filter((w) => w.startsWith("-"));
    const short = flags.filter((f) => !f.startsWith("--")).join(""); // "-rf" and "-r -f" both contain r and f
    const program = words[0]?.split("/").pop(); // "/bin/rm" counts as "rm"

    const recursive = /[rR]/.test(short) || flags.includes("--recursive");
    const force = short.includes("f") || flags.includes("--force");
    if (program === "rm" && recursive && force) {
      return "Blocked: rm with -r and -f deletes without asking. Delete specific files, or ask the user first.";
    }
    if (program === "git" && words.includes("push") && force) {
      return "Blocked: git push --force can overwrite other people's work. Use a normal push, or ask the user first.";
    }
  }
  return null;
}
