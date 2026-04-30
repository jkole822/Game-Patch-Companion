"use client";

import { Button, Modal } from "@/components";

import type { DeleteModalProps } from "./DeleteModal.types";

export const DeleteModal = ({
  confirmLabel,
  description,
  errorMessage,
  formAction,
  itemName,
  pending = false,
  resourceLabel,
  triggerLabel,
}: DeleteModalProps) => {
  const normalizedResourceLabel = resourceLabel.trim();
  const defaultTriggerLabel = `Delete ${normalizedResourceLabel}`;
  const defaultDescription = `This permanently removes the ${normalizedResourceLabel} record. If other entries still reference it, deletion will be blocked.`;

  return (
    <div className="space-y-3">
      {errorMessage}

      <Modal
        bodyClassName="space-y-5"
        description={description ?? defaultDescription}
        title={`Delete ${normalizedResourceLabel}?`}
        trigger={
          <button
            className="border-danger/50 bg-danger/10 text-danger hover:border-danger inline-flex cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)]"
            type="button"
          >
            {triggerLabel ?? defaultTriggerLabel}
          </button>
        }
      >
        <p className="text-text-muted text-sm leading-6">
          You are about to delete <span className="text-text font-semibold">{itemName}</span>. This
          action cannot be undone.
        </p>
        <form action={formAction} className="flex flex-wrap justify-end gap-3">
          <Button loading={pending} type="submit">
            {confirmLabel ?? defaultTriggerLabel}
          </Button>
        </form>
      </Modal>
    </div>
  );
};
