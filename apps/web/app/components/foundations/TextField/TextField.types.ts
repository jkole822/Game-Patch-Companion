import type { InputHTMLAttributes } from "react";

interface BaseTextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "defaultValue" | "onChange" | "value"
> {
  errorMessage?: string;
  label: string;
}

interface ControlledTextFieldProps extends BaseTextFieldProps {
  defaultValue?: never;
  onChange: (value: string) => void;
  value: string;
}

interface UncontrolledTextFieldProps extends BaseTextFieldProps {
  defaultValue?: string;
  onChange?: never;
  value?: never;
}

export type TextFieldProps = ControlledTextFieldProps | UncontrolledTextFieldProps;
