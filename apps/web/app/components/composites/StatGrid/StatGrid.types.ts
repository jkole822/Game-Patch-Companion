import type { ReactNode } from "react";

export interface StatGridItem {
  description: string;
  eyebrow: string;
  value: ReactNode;
}

export interface StatGridProps {
  stats: StatGridItem[];
}
