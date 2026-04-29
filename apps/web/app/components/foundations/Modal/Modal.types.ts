import type { DialogProps } from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

type ControlledModalProps = Pick<DialogProps, "defaultOpen" | "modal" | "onOpenChange" | "open">;

export type ModalProps = ControlledModalProps & {
  bodyClassName?: string;
  children: ReactNode;
  className?: string;
  closeLabel?: string;
  contentClassName?: string;
  description?: ReactNode;
  hideDescription?: boolean;
  hideHeader?: boolean;
  hideTitle?: boolean;
  overlayClassName?: string;
  title: ReactNode;
  trigger?: ReactNode;
};
