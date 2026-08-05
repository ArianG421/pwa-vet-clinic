import type { AssistantIndexEntry } from "@/lib/data/assistant-index";

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

// Small hand-rolled ranking function — ~40-60 entries is well within what a
// plain scoring loop handles instantly, no need for a fuzzy-search package.
export function searchIndex(index: AssistantIndexEntry[], query: string, limit = 6): AssistantIndexEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const queryTokens = tokenize(q);

  const scored = index.map((entry) => {
    const title = entry.title.toLowerCase();
    const description = entry.description.toLowerCase();
    const keywords = (entry.keywords ?? "").toLowerCase();
    let score = 0;

    if (title.startsWith(q)) score += 10;
    else if (title.includes(q)) score += 6;
    if (description.includes(q)) score += 3;
    if (keywords.includes(q)) score += 5;

    const entryTokens = new Set([...tokenize(entry.title), ...tokenize(entry.description), ...tokenize(keywords)]);
    for (const token of queryTokens) {
      if (entryTokens.has(token)) score += 1;
    }

    return { entry, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.entry);
}
