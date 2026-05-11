"use client";

import { useActionState } from "react";

import { Button, Drawer, FormMessage, SelectField, TextField } from "@/components";

import { INITIAL_WATCHLISTS_PAGE_ACTION_STATE } from "../watchlists.types";

import type { WatchlistFormDrawerProps } from "../watchlists.types";

export const WatchlistDrawerForm = ({
  action,
  description,
  games,
  initialValues,
  submitLabel,
  title,
  trigger,
}: WatchlistFormDrawerProps) => {
  const [state, formAction, pending] = useActionState(action, INITIAL_WATCHLISTS_PAGE_ACTION_STATE);

  return (
    <Drawer contentClassName="max-w-2xl" description={description} title={title} trigger={trigger}>
      <form action={formAction} className="space-y-6">
        <FormMessage error={state.error} success={state.success} />
        <div className="grid gap-4">
          <TextField
            defaultValue={initialValues?.name}
            label="Watchlist name"
            name="name"
            required
            type="text"
            validationMessages={{
              valueMissing: "Watchlist name is required.",
            }}
          />
          <SelectField
            defaultValue={initialValues?.gameId ?? ""}
            label="Game"
            name="gameId"
            required
            validationMessages={{
              valueMissing: "Choose a game for this watchlist.",
            }}
          >
            <option value="">Select a game</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.title}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="flex justify-end">
          <Button loading={pending} type="submit">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};
