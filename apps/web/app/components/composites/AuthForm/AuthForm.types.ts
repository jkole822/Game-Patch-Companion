export interface AuthFormActionState {
  error: string | null;
}

export type AuthFormAction = (
  state: AuthFormActionState,
  formData: FormData,
) => Promise<AuthFormActionState>;

export interface AuthFormProps {
  action: AuthFormAction;
  className?: string;
  title: string;
  variant?: "login" | "register";
}
