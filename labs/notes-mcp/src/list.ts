// Lists what the notes server offers, grouped by who controls each primitive. Usage: npm run list
import { initialize, request, startServer, stopServer } from "./rpc.js";

startServer(false);

const hello = await initialize();
const { tools } = (await request("tools/list")).result;
const { resources } = (await request("resources/list")).result;
const { prompts } = (await request("prompts/list")).result;

console.log(`Server: ${hello.result.serverInfo.name}, protocol ${hello.result.protocolVersion}\n`);
console.log("Tools (the model decides when to call them):");
for (const t of tools) console.log(`  ${t.name} — ${t.description}`);
console.log("\nResources (the app or you attach them):");
for (const r of resources) console.log(`  ${r.uri} — ${r.title}`);
console.log("\nPrompts (you pick them):");
for (const p of prompts) console.log(`  ${p.name} — ${p.description}`);

stopServer();
