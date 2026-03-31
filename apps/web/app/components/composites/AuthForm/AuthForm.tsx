"use client";

import { Bomb } from "lucide-react";
import { useActionState } from "react";

import { Button, Container, TextField } from "@/components";
import { getClassName } from "@/lib/utils";

import type { AuthFormActionState, AuthFormProps } from "./AuthForm.types";

const INITIAL_STATE: AuthFormActionState = { error: null };

export const AuthForm = ({ action, className, title, variant }: AuthFormProps) => {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);

  const isRegistering = variant === "register";

  return (
    <Container
      className={getClassName("w-full", className)}
      contentClassName="flex flex-col gap-15"
    >
      <h1 className="hs-1 text-center">{title}</h1>
      {state.error && (
        <p className="text-danger flex items-center gap-2 border px-2 py-1 text-sm">
          <Bomb size={14} />
          <span className="flex gap-1">
            <strong>Error:</strong>
            <span>{state.error}</span>
          </span>
        </p>
      )}
      <form action={formAction} className="flex w-full flex-col gap-4">
        <TextField
          autoComplete="email"
          label="Email"
          name="email"
          onChange={() => {}}
          type="email"
        />
        <TextField
          autoComplete="new-password"
          label="Password"
          name="password"
          onChange={() => {}}
          type="password"
        />
        {isRegistering && (
          <TextField
            autoComplete="new-password"
            label="Confirm Password"
            name="confirmPassword"
            onChange={() => {}}
            type="password"
          />
        )}
        <Button loading={pending} type="submit">
          Submit
        </Button>
      </form>
    </Container>
  );
};
