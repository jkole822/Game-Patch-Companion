"use client";

import { useActionState } from "react";

import { Button, Container, FormMessage, Link, TextField } from "@/components";

import { forgotPasswordAction } from "./actions";
import { INITIAL_FORGOT_PASSWORD_STATE } from "./types";

export const ForgotPasswordForm = () => {
  const [state, formAction, pending] = useActionState(
    forgotPasswordAction,
    INITIAL_FORGOT_PASSWORD_STATE,
  );

  return (
    <Container className="w-full" contentClassName="flex flex-col gap-15">
      <h1 className="hs-1 text-center">Forgot Password</h1>
      <FormMessage error={state.error} success={state.success} />
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
