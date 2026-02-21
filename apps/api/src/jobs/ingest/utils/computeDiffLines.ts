import { diffLines } from "diff";

export function computeLineDiff(prev: string, next: string) {
  const parts = diffLines(prev, next);

  const added: string[] = [];
  const removed: string[] = [];

  for (const p of parts) {
    const lines = p.value
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (p.added) added.push(...lines);
    else if (p.removed) removed.push(...lines);
  }

  const uniq = (arr: string[]) => Array.from(new Set(arr));

  return {
    added: uniq(added),
    removed: uniq(removed),
    stats: { addedCount: uniq(added).length, removedCount: uniq(removed).length },
  };
}
