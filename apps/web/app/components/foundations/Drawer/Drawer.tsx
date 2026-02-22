"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import type { DrawerProps } from "./Drawer.types";

import { getClassName } from "@/lib/utils";

import "./Drawer.css";

export const Drawer = ({
  children,
  className,
  closeLabel = "Close drawer",
  contentClassName,
  defaultOpen,
  description,
  hideDescription,
  hideHeader,
  hideTitle,
  modal,
  onOpenChange,
  open,
  title,
  trigger,
}: DrawerProps) => {
  return (
    <Dialog.Root defaultOpen={defaultOpen} modal={modal} onOpenChange={onOpenChange} open={open}>
      <div className={getClassName("drawer-root", className)}>
        {Boolean(trigger) && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
        <Dialog.Portal>
          <Dialog.Overlay className="drawer-overlay" />
          <Dialog.Content className={getClassName("drawer-content", contentClassName)}>
            <div className={`drawer-header ${hideHeader ? "sr-only" : ""}`}>
              <div className="drawer-header-copy">
                <Dialog.Title className={`drawer-title ${hideTitle ? "sr-only" : ""}`}>
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description
                    className={`drawer-description ${hideDescription ? "sr-only" : ""}`}
                  >
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close aria-label={closeLabel} className="drawer-close" type="button">
                <X size={18} />
              </Dialog.Close>
            </div>
            <div className="drawer-body">{children}</div>
          </Dialog.Content>
        </Dialog.Portal>
      </div>
    </Dialog.Root>
  );
};
