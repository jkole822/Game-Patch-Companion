function makeMatcher(raw: string) {
  const needle = raw.trim().toLowerCase();
  return (line: string) => line.toLowerCase().includes(needle);
}

export function matchWatchlistItems(
  items: { id: string; keyword: string }[],
  diff: { added: string[]; removed: string[] },
) {
  const matches: Array<{ itemId: string; kind: "added" | "removed"; text: string }> = [];

  for (const item of items) {
    const isMatch = makeMatcher(item.keyword);

    for (const line of diff.added) {
      if (isMatch(line)) {
        matches.push({ itemId: item.id, kind: "added", text: line });
      }
    }

    for (const line of diff.removed) {
      if (isMatch(line)) {
        matches.push({ itemId: item.id, kind: "removed", text: line });
      }
    }
  }

  return matches;
}
