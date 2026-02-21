import type { StructuredLine } from "@api-jobs/ingest/ingest.types";

function keyLine(l: StructuredLine) {
  return `[${l.path.join(" > ")}] ${l.text}`.replace(/\s+/g, " ").trim();
}

export function diffStructuredLines(prevJson: string | null | undefined, nextJson: string) {
  const prev: StructuredLine[] = prevJson ? JSON.parse(prevJson) : [];
  const next: StructuredLine[] = nextJson ? JSON.parse(nextJson) : [];

  const prevKeys = new Set(prev.map(keyLine));
  const nextKeys = new Set(next.map(keyLine));

  const added = next.map(keyLine).filter((k) => !prevKeys.has(k));
  const removed = prev.map(keyLine).filter((k) => !nextKeys.has(k));

  // uniq (preserve order)
  const uniq = (arr: string[]) => Array.from(new Set(arr));

  const addedU = uniq(added);
  const removedU = uniq(removed);

  return {
    added: addedU,
    removed: removedU,
    stats: { addedCount: addedU.length, removedCount: removedU.length },
  };
}
