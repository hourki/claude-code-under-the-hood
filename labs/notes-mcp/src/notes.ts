// The "notes" MCP server: 4 tools, 1 resource, 1 prompt.
// Every note lives in ONE file, notes.json, in this example's own folder.
// The server never reads or writes anything else.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

export type Note = { title: string; text: string };

// This file runs from dist/, so "../notes.json" is the example folder, on every OS.
export const NOTES_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "notes.json");

// The tests pass their own file, so they never touch your real notes.
export function loadNotes(file = NOTES_FILE): Note[] {
  return existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as Note[]) : [];
}

export function saveNotes(notes: Note[], file = NOTES_FILE): void {
  writeFileSync(file, JSON.stringify(notes, null, 2));
}

// Every tool answers with plain text. This builds that answer.
function reply(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

function asMarkdown(notes: Note[]): string {
  return notes.map((n) => `## ${n.title}\n\n${n.text}`).join("\n\n") || "No notes yet.";
}

// The SDK calls this once per client connection, so it must return a NEW server each time.
export function createServer(): McpServer {
  const server = new McpServer({ name: "notes", version: "1.0.0" });
  addNoteTool(server);
  listNotesTool(server);
  searchNotesTool(server);
  deleteNoteTool(server);
  allNotesResource(server);
  summarizePrompt(server);
  return server;
}

// A tool = name + description + input schema (what tools/list returns) + a handler (what tools/call runs).
function addNoteTool(server: McpServer): void {
  server.registerTool(
    "add_note",
    {
      description: "Save a note. A note with the same title is replaced.",
      inputSchema: z.object({
        title: z.string().min(1).describe("Short title, used to find the note again"),
        text: z.string().describe("The note itself"),
      }),
    },
    async ({ title, text }) => {
      const notes = loadNotes().filter((n) => n.title !== title);
      notes.push({ title, text });
      saveNotes(notes);
      return reply(`Saved "${title}". You have ${notes.length} note(s).`);
    },
  );
}

function listNotesTool(server: McpServer): void {
  server.registerTool(
    "list_notes",
    { description: "List the titles of all notes." },
    async () => reply(loadNotes().map((n) => `- ${n.title}`).join("\n") || "No notes yet."),
  );
}

function searchNotesTool(server: McpServer): void {
  server.registerTool(
    "search_notes",
    {
      description: "Find notes whose title or text contains the query (not case-sensitive).",
      inputSchema: z.object({ query: z.string().min(1).describe("Word or phrase to look for") }),
    },
    async ({ query }) => {
      const q = query.toLowerCase();
      const hits = loadNotes().filter((n) => `${n.title}\n${n.text}`.toLowerCase().includes(q));
      return reply(hits.length ? asMarkdown(hits) : `No notes match "${query}".`);
    },
  );
}

function deleteNoteTool(server: McpServer): void {
  server.registerTool(
    "delete_note",
    {
      description: "Delete the note with this exact title.",
      inputSchema: z.object({ title: z.string().describe("Exact title, as shown by list_notes") }),
      // Claude Code reads this flag: it asks you before every delete, even when an allow rule matches.
      _meta: { "anthropic/requiresUserInteraction": true },
    },
    async ({ title }) => {
      const notes = loadNotes();
      const kept = notes.filter((n) => n.title !== title);
      // isError: true tells the model the call failed, so it can try something else.
      if (kept.length === notes.length) return { ...reply(`No note titled "${title}".`), isError: true };
      saveNotes(kept);
      return reply(`Deleted "${title}".`);
    },
  );
}

// A resource = read-only data the app can attach to the conversation, addressed by a URI.
function allNotesResource(server: McpServer): void {
  server.registerResource(
    "all-notes",
    "notes://all",
    { title: "All notes", description: "Every note, as Markdown", mimeType: "text/markdown" },
    async (uri) => ({ contents: [{ uri: uri.href, mimeType: "text/markdown", text: asMarkdown(loadNotes()) }] }),
  );
}

// A prompt = a ready-made message the user picks, here "summarize my notes".
function summarizePrompt(server: McpServer): void {
  server.registerPrompt(
    "summarize_notes",
    { title: "Summarize my notes", description: "Ask the model to summarize every note." },
    () => {
      const text = `Summarize these notes in 5 bullets or fewer:\n\n${asMarkdown(loadNotes())}`;
      return { messages: [{ role: "user" as const, content: { type: "text" as const, text } }] };
    },
  );
}
