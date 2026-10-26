---
name: notes-review
description: Review the user's notes with the notes MCP tools - find duplicates, stale items and notes worth pinning, then propose a cleanup. Use when the user asks to tidy, review or organize their notes.
---

Review the notes, then propose a cleanup. Don't change anything until the user agrees.

1. Call `list_notes`, then read the `notes://all` resource to see every note.
2. Group what you find: duplicates, notes that look out of date, and notes worth pinning.
3. Reply with a short table: title, what you suggest (keep, merge, delete, pin), and why.
4. To pin a note, suggest renaming it with `add_note` so its title starts with "pinned". Pinned notes can't be deleted.
5. Only call `delete_note` after the user says yes to a specific title.
