// A tiny MCP client for the demos: starts the notes server over stdio and sends JSON-RPC by hand.
import { spawn, type ChildProcessByStdio } from "node:child_process";
import path from "node:path";
import { createInterface } from "node:readline";
import type { Readable, Writable } from "node:stream";
import { fileURLToPath } from "node:url";

export type Message = { jsonrpc: "2.0"; id?: number; method?: string; params?: unknown; result?: any; error?: unknown };

const serverPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "stdio.js");
// Replies arrive in any order, so each request id remembers who is waiting for its reply.
const waiting = new Map<number, (reply: Message) => void>();
let server: ChildProcessByStdio<Writable, Readable, null>;
let printMessages = false;
let nextId = 1;

// Starts the notes server as a child process. With print = true, every message is printed.
export function startServer(print: boolean): void {
  printMessages = print;
  server = spawn(process.execPath, [serverPath], { stdio: ["pipe", "pipe", print ? "inherit" : "ignore"] });
  createInterface({ input: server.stdout }).on("line", receive);
}

export function stopServer(): void {
  server.kill();
}

function receive(line: string): void {
  const msg = JSON.parse(line) as Message;
  if (printMessages) console.log(`\n⬅  SERVER → HOST\n${JSON.stringify(msg, null, 2)}`);
  if (msg.id !== undefined) waiting.get(msg.id)?.(msg);
}

function send(msg: Message): void {
  if (printMessages) console.log(`\n➡  HOST → SERVER\n${JSON.stringify(msg, null, 2)}`);
  server.stdin.write(JSON.stringify(msg) + "\n");
}

export function request(method: string, params: unknown = {}): Promise<Message> {
  const id = nextId++;
  return new Promise((resolve) => {
    waiting.set(id, resolve);
    send({ jsonrpc: "2.0", id, method, params });
  });
}

// The 2025-era handshake, which the server still accepts.
export async function initialize(): Promise<Message> {
  const reply = await request("initialize", { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "demo", version: "1.0" } });
  send({ jsonrpc: "2.0", method: "notifications/initialized" }); // a notification: no id, no reply
  return reply;
}
