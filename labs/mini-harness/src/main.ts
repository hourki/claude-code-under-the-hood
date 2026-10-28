// A minimal agent host: one question, one read-only tool, every message printed.
// Needs ANTHROPIC_API_KEY in the environment. Each run calls the Claude API.
import { createSdkMcpServer, query, tool, type SDKMessage } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { lookupService } from "./inventory.js";

const lookup = tool(
  "lookup_service",
  "Look up one service in the local inventory: its status, version and notes.",
  { name: z.string().describe("The service name, like payments") },
  async ({ name }) => {
    const service = lookupService(name);
    if (!service) {
      return { content: [{ type: "text", text: `No service named ${name}` }], isError: true };
    }
    return { content: [{ type: "text", text: JSON.stringify(service) }] };
  },
  { annotations: { readOnlyHint: true } }
);

// In-process MCP server. alwaysLoad keeps the tool's schema in the first prompt, so no ToolSearch step.
const inventory = createSdkMcpServer({ name: "inventory", version: "1.0.0", tools: [lookup], alwaysLoad: true });

const prompt = process.argv[2] ?? "Is the payments service healthy, and which version does it run?";

const options = {
  mcpServers: { inventory },
  tools: [], // no built-in tools: no Bash, Read, Write or Edit
  allowedTools: ["mcp__inventory__lookup_service"], // pre-approve our one tool
  permissionMode: "dontAsk" as const, // anything not pre-approved is denied, never prompted
  settingSources: [], // ignore CLAUDE.md and settings files on disk
  maxTurns: 5,
};

type Block = { type: string; text?: string; name?: string; input?: unknown; content?: unknown };

function describeBlock(block: Block): string {
  if (block.type === "text") return `text: ${block.text}`;
  if (block.type === "tool_use") return `tool_use ${block.name} ${JSON.stringify(block.input)}`;
  if (block.type === "tool_result") return `tool_result ${JSON.stringify(block.content)}`;
  return block.type;
}

function describeContent(content: unknown): string {
  if (typeof content === "string") return `text: ${content}`;
  return (content as Block[]).map(describeBlock).join(" | ");
}

function describe(message: SDKMessage): string {
  const label = "subtype" in message ? `[${message.type}/${message.subtype}]` : `[${message.type}]`;
  if (message.type === "system" && message.subtype === "init") {
    return `${label} model=${message.model} tools=${message.tools.join(",")} mode=${message.permissionMode}`;
  }
  if (message.type === "assistant" || message.type === "user") {
    return `${label} ${describeContent(message.message.content)}`;
  }
  if (message.type === "result") {
    const answer = message.subtype === "success" ? `\n${message.result}` : "";
    return `${label} turns=${message.num_turns} denials=${message.permission_denials.length}${answer}`;
  }
  return label;
}

for await (const message of query({ prompt, options })) {
  console.log(describe(message));
}
