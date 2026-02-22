import type { InputHTMLAttributes } from "react";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  errorMessage?: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}
