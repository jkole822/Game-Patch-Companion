import type { LucideIcon } from "lucide-react";

export interface SourceFeature {
  description: string;
  icon: LucideIcon;
  title: string;
}

export interface SourceStat {
  description: string;
  eyebrow: string;
  value: number;
}
