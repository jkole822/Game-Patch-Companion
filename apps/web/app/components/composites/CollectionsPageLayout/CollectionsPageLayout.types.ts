import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface CollectionsPageLayoutProps {
  children: ReactNode;
  className?: string;
  description: string;
  eyebrow: string;
  gridClassName?: string;
  headerActions?: ReactNode;
  icon: LucideIcon;
  leftPanelContent: ReactNode;
  partialData: boolean;
  resourceLabelPlural: string;
  rightPanelContent: ReactNode;
  rightPanelEyebrow: string;
  rightPanelTitle: string;
  title: string;
}
