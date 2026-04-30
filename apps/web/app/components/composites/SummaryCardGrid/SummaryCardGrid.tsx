import { getClassName } from "@/lib/utils";

import type { SummaryCardGridProps } from "./SummaryCardGrid.types";

export const SummaryCardGrid = ({ items }: SummaryCardGridProps) => {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {items.map((item) => (
        <article
          className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5"
          key={item.id}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">{item.header}</div>
            {item.meta}
          </div>

          {item.details?.map((detail, detailIndex) => (
            <div
              className="mt-3 grid items-center gap-3 first:mt-5 sm:grid-cols-[auto_1fr]"
              key={detail.key ?? `${item.id}-detail-${detailIndex}`}
            >
              <div className="text-text-muted text-xs font-semibold tracking-[0.18em] uppercase">
                {detail.label}
              </div>
              <div className={getClassName("text-text text-sm leading-6", detail.valueClassName)}>
                {detail.value}
              </div>
            </div>
          ))}

          {item.footer ? <div className="mt-5 flex flex-wrap gap-3">{item.footer}</div> : null}
        </article>
      ))}
    </div>
  );
};
