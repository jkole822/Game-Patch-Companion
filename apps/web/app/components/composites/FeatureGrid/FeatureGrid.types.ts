import type { LucideIcon } from "lucide-react";

export interface FeatureGridItem {
  description: string;
  icon: LucideIcon;
  title: string;
}

export interface FeatureGridProps {
  features: FeatureGridItem[];
}
