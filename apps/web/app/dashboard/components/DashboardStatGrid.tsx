import type { DashboardStat } from "../dashboard.types";

type DashboardStatGridProps = {
  stats: DashboardStat[];
};

export const DashboardStatGrid = ({ stats }: DashboardStatGridProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {stats.map(({ icon: Icon, label, value }) => (
        <div
          className="border-border bg-surface/75 rounded-3xl border px-5 py-4 shadow-[0_18px_60px_rgba(11,14,25,0.35)]"
          key={label}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-text-muted text-xs tracking-[0.24em] uppercase">{label}</span>
            <Icon className="text-primary-light size-4" />
          </div>
          <p className="font-display text-4xl font-semibold tracking-tight text-white">{value}</p>
        </div>
      ))}
    </div>
  );
};
