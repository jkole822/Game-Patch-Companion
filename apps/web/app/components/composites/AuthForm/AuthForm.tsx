"use client";

import { Bomb } from "lucide-react";
import { useActionState } from "react";

import { Button, Container, Link, TextField } from "@/components";
import { getClassName } from "@/lib/utils";

import type { AuthFormActionState, AuthFormProps } from "./AuthForm.types";

const INITIAL_STATE: AuthFormActionState = { error: null };

export const AuthForm = ({ action, className, title, variant }: AuthFormProps) => {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);

  const isRegistering = variant === "register";
  const submitLabel = isRegistering ? "Register" : "Login";
  const alternateHref = isRegistering ? "/login" : "/register";
  const alternateLabel = isRegistering ? "Log in" : "Register";
  const alternatePrompt = isRegistering ? "Already have an account?" : "Need an account?";

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
        <TextField autoComplete="email" label="Email" name="email" type="email" />
        <TextField autoComplete="new-password" label="Password" name="password" type="password" />
        {!isRegistering && (
          <p className="text-right text-sm text-white/85">
            <Link href="/forgot-password">Forgot password?</Link>
          </p>
        )}
        {isRegistering && (
          <TextField
            autoComplete="new-password"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
          />
        )}
        <Button loading={pending} type="submit">
          {submitLabel}
        </Button>
      </form>
      <p className="text-center text-sm text-white/85">
        {alternatePrompt} <Link href={alternateHref}>{alternateLabel}</Link>
      </p>
    </Container>
  );
};
