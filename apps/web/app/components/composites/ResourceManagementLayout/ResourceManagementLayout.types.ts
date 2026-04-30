import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface ResourceManagementLayoutProps {
  badgeIcon?: LucideIcon;
  badgeLabel?: string;
  children: ReactNode;
  description: string;
  formEyebrow: string;
  formTitle: string;
  heading: string;
  sidebarContent?: ReactNode;
  supportCopy?: ReactNode;
  supportIcon?: LucideIcon;
}
