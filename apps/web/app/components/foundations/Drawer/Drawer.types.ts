import type { DialogProps } from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

type ControlledDrawerProps = Pick<DialogProps, "defaultOpen" | "modal" | "onOpenChange" | "open">;

export type DrawerProps = ControlledDrawerProps & {
  children: ReactNode;
  className?: string;
  closeLabel?: string;
  contentClassName?: string;
  description?: ReactNode;
  hideDescription?: boolean;
  hideHeader?: boolean;
  hideTitle?: boolean;
  title: ReactNode;
  trigger?: ReactNode;
};
