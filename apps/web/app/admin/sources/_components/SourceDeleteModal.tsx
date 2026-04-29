"use client";

import { useActionState } from "react";

import { Button, Modal } from "@/components";

import { INITIAL_SOURCE_ACTION_STATE } from "./sourceForm.types";

import type { SourceActionState } from "./sourceForm.types";

type SourceDeleteModalProps = {
  action: (state: SourceActionState | undefined, formData: FormData) => Promise<SourceActionState>;
  sourceName: string;
};

export const SourceDeleteModal = ({ action, sourceName }: SourceDeleteModalProps) => {
  const [state, formAction, pending] = useActionState(action, INITIAL_SOURCE_ACTION_STATE);

  return (
    <div className="space-y-3">
      {state.error && (
        <p className="text-danger border-danger/40 bg-danger/10 border px-3 py-2 text-sm">
          {state.error}
        </p>
      )}

      <Modal
        bodyClassName="space-y-5"
        description="This permanently removes the source record. If patch entries still reference it, deletion will be blocked."
        title="Delete source?"
        trigger={
          <button
            className="border-danger/50 bg-danger/10 text-danger hover:border-danger inline-flex cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)]"
            type="button"
          >
            Delete source
          </button>
        }
      >
        <p className="text-text-muted text-sm leading-6">
          You are about to delete <span className="text-text font-semibold">{sourceName}</span>.
          This action cannot be undone.
        </p>
        <form action={formAction} className="flex flex-wrap justify-end gap-3">
          <Button loading={pending} type="submit">
            Delete source
          </Button>
        </form>
      </Modal>
    </div>
  );
};
