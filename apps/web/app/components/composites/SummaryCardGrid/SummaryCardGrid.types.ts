import type { ReactNode } from "react";

export interface SummaryCardDetail {
  key?: string;
  label: ReactNode;
  value: ReactNode;
  valueClassName?: string;
}

export interface SummaryCardGridItem {
  details?: SummaryCardDetail[];
  footer?: ReactNode;
  header: ReactNode;
  id: string;
  meta?: ReactNode;
}

export interface SummaryCardGridProps {
  items: SummaryCardGridItem[];
}
