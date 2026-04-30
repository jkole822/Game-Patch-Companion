import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface CollectionsPageLayoutProps {
  children: ReactNode;
  className?: string;
  createHref: string;
  description: string;
  eyebrow: string;
  gridClassName?: string;
  icon: LucideIcon;
  leftPanelContent: ReactNode;
  partialData: boolean;
  resourceLabelPlural: string;
  resourceLabelSingular: string;
  rightPanelContent: ReactNode;
  rightPanelEyebrow: string;
  rightPanelTitle: string;
  title: string;
}
