"use client";

import { Bomb, CircleCheckBig } from "lucide-react";
import { useActionState } from "react";

import { Button, Container, Link, TextField } from "@/components";

import { forgotPasswordAction } from "./actions";

import type { ForgotPasswordActionState } from "./actions";

const INITIAL_STATE: ForgotPasswordActionState = {
  error: null,
  success: null,
};

export const ForgotPasswordForm = () => {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, INITIAL_STATE);

  return (
    <Container className="w-full" contentClassName="flex flex-col gap-15">
      <h1 className="hs-1 text-center">Forgot Password</h1>
      {state.error && (
        <p className="text-danger flex items-center gap-2 border px-2 py-1 text-sm">
          <Bomb size={14} />
          <span className="flex gap-1">
            <strong>Error:</strong>
            <span>{state.error}</span>
          </span>
        </p>
      )}
      {state.success && (
        <p className="text-success flex items-center gap-2 border px-2 py-1 text-sm">
          <CircleCheckBig size={14} />
          <span>{state.success}</span>
        </p>
      )}
      <form action={formAction} className="flex w-full flex-col gap-4">
        <TextField autoComplete="email" label="Email" name="email" type="email" />
        <Button loading={pending} type="submit">
          Send Reset Link
        </Button>
      </form>
      <p className="text-center text-sm text-white/85">
        Remembered it? <Link href="/login">Back to login</Link>
      </p>
    </Container>
  );
};
