"use client";

import { useActionState } from "react";

import { Button, DeleteModal, FormMessage, TextField } from "@/components";

import { GAME_FIELD_GUIDE } from "./GameFieldGuide";
import { INITIAL_GAME_ACTION_STATE } from "./GameForm.types";

import type { GameActionState, GameRecord } from "./GameForm.types";

const noopGameAction = async (
  state: GameActionState | undefined,
  _formData: FormData,
): Promise<GameActionState> => state ?? INITIAL_GAME_ACTION_STATE;

type GameFormProps = {
  action: (state: GameActionState | undefined, formData: FormData) => Promise<GameActionState>;
  cancelHref?: string;
  deleteAction?: (
    state: GameActionState | undefined,
    formData: FormData,
  ) => Promise<GameActionState>;
  initialGame?: GameRecord;
  submitLabel: string;
};

export const GameForm = ({
  action,
  cancelHref = "/dashboard",
  deleteAction,
  initialGame,
  submitLabel,
}: GameFormProps) => {
  const [state, formAction, pending] = useActionState(action, INITIAL_GAME_ACTION_STATE);
  const [deleteState, deleteFormAction, deletePending] = useActionState(
    deleteAction ?? noopGameAction,
    INITIAL_GAME_ACTION_STATE,
  );

  return (
    <form action={formAction} className="space-y-7">
      <FormMessage error={state.error} success={state.success} />
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          aria-describedby={GAME_FIELD_GUIDE.title.id}
          className="md:col-span-2"
          defaultValue={initialGame?.title}
          label="Title"
          name="title"
          required
          type="text"
          validationMessages={{
            valueMissing: "Title is required.",
          }}
        />
        <TextField
          aria-describedby={GAME_FIELD_GUIDE.key.id}
          defaultValue={initialGame?.key}
          label="Key"
          name="key"
          pattern="[a-z0-9-]+"
          required
          type="text"
          validationMessages={{
            patternMismatch: "Use lowercase letters, numbers, and hyphens only.",
            valueMissing: "Key is required.",
          }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {deleteAction && initialGame ? (
          <DeleteModal
            errorMessage={
              deleteState.error ? (
                <p className="text-danger border-danger/40 bg-danger/10 border px-3 py-2 text-sm">
                  {deleteState.error}
                </p>
              ) : undefined
            }
            formAction={deleteFormAction}
            itemName={initialGame.title}
            pending={deletePending}
            resourceLabel="game"
          />
        ) : (
          <div />
        )}

        <div className="flex flex-wrap justify-end gap-3">
          <Button href={cancelHref}>Cancel</Button>
          <Button loading={pending} type="submit">
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};
