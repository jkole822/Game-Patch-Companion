"use client";

import { useActionState } from "react";

import { Button, Drawer, FormMessage, TextField } from "@/components";

import { INITIAL_WATCHLISTS_PAGE_ACTION_STATE } from "../watchlists.types";

import type { WatchlistItemFormDrawerProps } from "../watchlists.types";

export const WatchlistItemDrawerForm = ({
  action,
  description,
  initialValues,
  submitLabel,
  title,
  trigger,
}: WatchlistItemFormDrawerProps) => {
  const [state, formAction, pending] = useActionState(action, INITIAL_WATCHLISTS_PAGE_ACTION_STATE);

  return (
    <Drawer contentClassName="max-w-xl" description={description} title={title} trigger={trigger}>
      <form action={formAction} className="space-y-6">
        <FormMessage error={state.error} success={state.success} />
        <input name="watchlistId" type="hidden" value={initialValues?.watchlistId ?? ""} />
        <TextField
          defaultValue={initialValues?.keyword}
          label="Keyword"
          name="keyword"
          required
          type="text"
          validationMessages={{
            valueMissing: "Keyword is required.",
          }}
        />

        <div className="flex justify-end">
          <Button loading={pending} type="submit">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};
