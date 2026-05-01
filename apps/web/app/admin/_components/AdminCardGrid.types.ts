import type { LucideIcon } from "lucide-react";

export type AdminCardGridItem = {
  ctaHref?: string;
  ctaLabel?: string;
  description: string;
  icon: LucideIcon;
  title: string;
};

export type AdminCardGridProps = {
  items: AdminCardGridItem[];
};
