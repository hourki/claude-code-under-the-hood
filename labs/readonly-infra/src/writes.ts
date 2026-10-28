// Returns a reason if a Bash command would change infrastructure, otherwise null.
// shortcut: plain word matching per segment; misses `bash -c "..."`, aliases, scripts and variables.
// It also blocks some reads that share a word, like `terraform state list`. Read-only credentials are the real guard.
const WRITE_WORDS = new Map<string, string[]>([
  ["kubectl", ["apply", "create", "delete", "edit", "patch", "replace", "scale", "set", "label", "annotate", "drain", "cordon", "taint", "rollout", "exec", "cp"]],
  ["terraform", ["apply", "destroy", "import", "state", "taint", "untaint", "force-unlock"]],
  ["helm", ["install", "upgrade", "uninstall", "delete", "rollback"]],
  ["aws", ["rm", "mv", "cp", "sync", "rb", "mb"]],
]);
// AWS API calls that change things start with a verb like these: delete-bucket, put-object, run-instances.
const AWS_WRITE_PREFIX = /^(create|delete|put|update|terminate|modify|attach|detach|start|stop|reboot|run)-/;

export function findWrite(command: string): string | null {
  // Check each part of a compound command: a && b, a || b, a; b, a | b, a & b.
  for (const segment of command.split(/[;|&\n]/)) {
    const words = segment.trim().split(/\s+/);
    while (words[0] === "sudo" || words[0]?.includes("=")) words.shift(); // sudo, FOO=bar
    const program = words[0]?.split("/").pop() ?? ""; // "/usr/local/bin/kubectl" counts as "kubectl"
    const writeWords = WRITE_WORDS.get(program) ?? [];
    // Any word, not just the second, so `kubectl -n prod delete pod x` is caught too.
    const hit = words.slice(1).find((w) => writeWords.includes(w) || (program === "aws" && AWS_WRITE_PREFIX.test(w)));
    if (hit) {
      return `Blocked: \`${program} ${hit}\` changes infrastructure, and this agent is read-only. Ask a human to run it.`;
    }
  }
  return null;
}
