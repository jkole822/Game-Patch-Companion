"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { getClassName } from "@/lib/utils";

import type { ModalProps } from "./Modal.types";
import "./Modal.css";

export const Modal = ({
  bodyClassName,
  children,
  className,
  closeLabel = "Close modal",
  contentClassName,
  defaultOpen,
  description,
  hideDescription,
  hideHeader,
  hideTitle,
  modal,
  onOpenChange,
  open,
  overlayClassName,
  title,
  trigger,
}: ModalProps) => {
  return (
    <Dialog.Root defaultOpen={defaultOpen} modal={modal} onOpenChange={onOpenChange} open={open}>
      <div className={getClassName("modal-root", className)}>
        {Boolean(trigger) && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
        <Dialog.Portal>
          <Dialog.Overlay className={getClassName("modal__overlay", overlayClassName)} />
          <Dialog.Content className={getClassName("modal__content", contentClassName)}>
            <div className={`modal__header ${hideHeader ? "sr-only" : ""}`}>
              <div className="modal__header-copy">
                <Dialog.Title className={`modal__title ${hideTitle ? "sr-only" : ""}`}>
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description
                    className={`modal__description ${hideDescription ? "sr-only" : ""}`}
                  >
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close aria-label={closeLabel} className="modal__close" type="button">
                <X size={18} />
              </Dialog.Close>
            </div>
            <div className={getClassName("modal__body", bodyClassName)}>{children}</div>
          </Dialog.Content>
        </Dialog.Portal>
      </div>
    </Dialog.Root>
  );
};
