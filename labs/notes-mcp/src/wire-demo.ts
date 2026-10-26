// Plays the HOST's role: starts the notes server over stdio and prints every raw JSON-RPC message.
// Usage: npm run demo. Needs nothing but Node.js. It adds one note, then deletes it again.
import { initialize, request, startServer, stopServer } from "./rpc.js";

startServer(true);

console.log("=== 1. CONNECT (the 2025-era handshake, which this server still accepts) ===");
await initialize();

console.log("\n=== 2. DISCOVERY (once per connection) ===");
await request("tools/list");
await request("resources/list");
await request("prompts/list");

console.log("\n=== 3. INVOCATION (every use) ===");
const title = "wire-demo note";
await request("tools/call", { name: "add_note", arguments: { title, text: "Written by the wire demo." } });
await request("resources/read", { uri: "notes://all" });
await request("prompts/get", { name: "summarize_notes" });
await request("tools/call", { name: "delete_note", arguments: { title } });

console.log("\n=== 4. A TOOL ERROR (the note is already gone) ===");
await request("tools/call", { name: "delete_note", arguments: { title } });

stopServer();
