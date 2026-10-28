// Run with: npm test (after npm run build). Nothing here calls a cluster or a cloud.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { findWrite } from "./writes.js";

const dist = path.dirname(fileURLToPath(import.meta.url));
const lab = path.join(dist, "..");
const runHook = (input: string) => spawnSync(process.execPath, [path.join(dist, "block-writes.js")], { input, encoding: "utf8" });

test("blocks every write verb, in any position and spelling", () => {
  for (const cmd of [
    "kubectl apply -f x.yaml", "kubectl -n prod delete pod web-1", "sudo /usr/local/bin/kubectl scale deploy web --replicas=0",
    "kubectl rollout restart deploy/web", "kubectl exec -it web-1 -- sh", "KUBECONFIG=prod.yaml kubectl edit cm app",
    "terraform apply", "terraform -chdir=infra destroy", "terraform state rm aws_s3_bucket.logs",
    "helm upgrade web ./chart", "helm uninstall web", "helm rollback web 3",
    "aws s3 rm s3://example-bucket/x", "aws ec2 terminate-instances --instance-ids i-0", "aws iam put-role-policy --role-name x",
    "kubectl get pods && kubectl delete pod web-1",
  ]) {
    assert.ok(findWrite(cmd), cmd);
  }
});

test("lets read commands through", () => {
  for (const cmd of ["kubectl get pods -A", "kubectl describe pod web-1", "kubectl logs web-1", "terraform plan", "terraform show",
    "helm list -A", "helm status web", "aws ec2 describe-instances", "aws s3 ls", "grep delete notes.txt"]) {
    assert.equal(findWrite(cmd), null, cmd);
  }
});

test("each sample gets the expected answer from the built hook", () => {
  for (const file of readdirSync(path.join(lab, "samples"))) {
    const result = runHook(readFileSync(path.join(lab, "samples", file), "utf8"));
    assert.equal(result.status, 0, file);
    assert.equal(result.stdout.includes('"permissionDecision":"deny"'), file.startsWith("blocked-"), file);
  }
});

test("bad input fails closed with exit code 2", () => {
  assert.equal(runHook("not json").status, 2);
});

test("settings.json denies the file tools and every program the hook guards", () => {
  const deny: string[] = JSON.parse(readFileSync(path.join(lab, "settings.json"), "utf8")).permissions.deny;
  for (const rule of ["Edit", "Write", "NotebookEdit", "Bash(kubectl delete *)", "Bash(terraform apply *)", "Bash(helm upgrade *)", "Bash(aws s3 rm *)"]) {
    assert.ok(deny.includes(rule), rule);
  }
});
