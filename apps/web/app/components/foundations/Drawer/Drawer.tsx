"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { getClassName } from "@/lib/utils";

import type { DrawerProps } from "./Drawer.types";
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
          <Dialog.Overlay className="drawer__overlay" />
          <Dialog.Content className={getClassName("drawer__content", contentClassName)}>
            <div className={`drawer__header ${hideHeader ? "sr-only" : ""}`}>
              <div className="drawer__header-copy">
                <Dialog.Title className={`drawer__title ${hideTitle ? "sr-only" : ""}`}>
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description
                    className={`drawer__description ${hideDescription ? "sr-only" : ""}`}
                  >
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close aria-label={closeLabel} className="drawer__close" type="button">
                <X size={18} />
              </Dialog.Close>
            </div>
            <div className="drawer__body">{children}</div>
          </Dialog.Content>
        </Dialog.Portal>
      </div>
    </Dialog.Root>
  );
};
