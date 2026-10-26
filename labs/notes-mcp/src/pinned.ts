// A note is pinned when its title starts with "pinned" (any case). The plugin hook refuses to delete those.
export const isPinned = (title: string): boolean => title.trim().toLowerCase().startsWith("pinned");
