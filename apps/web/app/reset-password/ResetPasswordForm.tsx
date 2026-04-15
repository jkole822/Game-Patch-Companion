"use client";

import { Bomb, CircleCheckBig } from "lucide-react";
import { useActionState } from "react";

import { Button, Container, Link, TextField } from "@/components";

import { resetPasswordAction } from "./actions";

import type { ResetPasswordActionState } from "./actions";

const INITIAL_STATE: ResetPasswordActionState = {
  error: null,
  success: null,
};

export const ResetPasswordForm = ({ token }: { token: string | null }) => {
  const [state, formAction, pending] = useActionState(resetPasswordAction, INITIAL_STATE);

  return (
    <Container className="w-full" contentClassName="flex flex-col gap-15">
      <h1 className="hs-1 text-center">Reset Password</h1>
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
        <input name="token" type="hidden" value={token ?? ""} />
        <TextField
          autoComplete="new-password"
          label="New Password"
          name="password"
          type="password"
        />
        <TextField
          autoComplete="new-password"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
        />
        <Button loading={pending} type="submit">
          Reset Password
        </Button>
      </form>
      <p className="text-center text-sm text-white/85">
        Back to <Link href="/login">login</Link>
      </p>
    </Container>
  );
};
