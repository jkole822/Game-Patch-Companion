import { Globe } from "lucide-react";

import { Button, Link } from "@/components";
import { formatDate } from "@/lib/utils";

import type { SourceRecord } from "./SourceForm.types";

const formatTypeLabel = (value: SourceRecord["type"]) => {
  return value.toUpperCase();
};

type SourceSummaryCardProps = {
  sources: SourceRecord[];
};

export const SourceSummaryCards = ({ sources }: SourceSummaryCardProps) => {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {sources.map((source) => (
        <article
          className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5"
          key={source.id}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow">{formatTypeLabel(source.type)}</span>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase ${
                    source.isEnabled
                      ? "border-success/40 bg-success/10 text-success"
                      : "border-border bg-background/65 text-text-muted"
                  }`}
                >
                  {source.isEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <h3 className="hs-3">{source.name}</h3>
              <p className="text-text-muted font-mono text-xs">{source.key}</p>
            </div>
            <p className="text-text-muted text-right text-xs tracking-[0.18em] uppercase">
              Created
              <span className="mt-2 block tracking-normal normal-case">
                {formatDate(source.createdAt, { invalidValueFallback: "Date unavailable" }) ??
                  "Date unavailable"}
              </span>
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[auto_1fr]">
            <div className="text-text-muted text-xs font-semibold tracking-[0.18em] uppercase">
              Base URL
            </div>
            <div className="text-text text-sm leading-6 break-all">{source.baseUrl}</div>
          </div>

          {source.type === "html" && (
            <div className="mt-3 grid gap-3 sm:grid-cols-[auto_1fr]">
              <div className="text-text-muted text-xs font-semibold tracking-[0.18em] uppercase">
                List path
              </div>
              <div className="text-text text-sm leading-6 break-all">{source.config.listPath}</div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <Button href={`/admin/sources/${source.id}/edit`}>Edit source</Button>
            <Link href={source.baseUrl} target="_blank">
              <span className="inline-flex items-center gap-2">
                <Globe className="size-4" />
                Open origin
              </span>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
};
