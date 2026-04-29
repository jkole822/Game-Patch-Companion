export interface AuthFormProps {
  action: string;
  className?: string;
  error?: string | null;
  title: string;
  variant?: "login" | "register";
}
