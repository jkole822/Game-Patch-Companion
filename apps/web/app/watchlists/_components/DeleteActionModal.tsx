"use client";

import { useActionState } from "react";

import { DeleteModal } from "@/components";

import { INITIAL_WATCHLISTS_PAGE_ACTION_STATE } from "../watchlists.types";

import type { DeleteActionModalProps } from "../watchlists.types";

export const DeleteActionModal = ({
  action,
  description,
  itemName,
  resourceLabel,
  triggerLabel,
}: DeleteActionModalProps) => {
  const [state, formAction, pending] = useActionState(action, INITIAL_WATCHLISTS_PAGE_ACTION_STATE);

  return (
    <DeleteModal
      description={description}
      errorMessage={
        state.error ? (
          <p className="text-danger border-danger/40 bg-danger/10 border px-3 py-2 text-sm">
            {state.error}
          </p>
        ) : undefined
      }
      formAction={formAction}
      itemName={itemName}
      pending={pending}
      resourceLabel={resourceLabel}
      triggerLabel={triggerLabel}
    />
  );
};
