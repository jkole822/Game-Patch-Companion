import { Button, Container, FormMessage, Link, TextField } from "@/components";
import { getClassName } from "@/lib/utils";

import type { AuthFormProps } from "./AuthForm.types";

export const AuthForm = ({ action, className, error, title, variant }: AuthFormProps) => {
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
      <FormMessage error={error} />
      <form action={action} className="flex w-full flex-col gap-4" method="post">
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
        <Button type="submit">{submitLabel}</Button>
      </form>
      <p className="text-center text-sm text-white/85">
        {alternatePrompt} <Link href={alternateHref}>{alternateLabel}</Link>
      </p>
    </Container>
  );
};
