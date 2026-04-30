import type { StatGridProps } from "./StatGrid.types";

export const StatGrid = ({ stats }: StatGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map(({ description, eyebrow, value }) => (
        <div
          className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5"
          key={eyebrow}
        >
          <p className="eyebrow">{eyebrow}</p>
          <p className="font-display mt-3 text-4xl text-white">{value}</p>
          <p className="text-text-muted mt-2 text-sm">{description}</p>
        </div>
      ))}
    </div>
  );
};
