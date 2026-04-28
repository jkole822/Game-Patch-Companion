import type { SelectHTMLAttributes } from "react";

export type SelectFieldValidationMessages = Partial<Record<"valueMissing", string>>;

interface BaseSelectFieldProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "defaultValue" | "onChange" | "value"
> {
  errorMessage?: string;
  label: string;
  validationMessages?: SelectFieldValidationMessages;
}

interface ControlledSelectFieldProps extends BaseSelectFieldProps {
  defaultValue?: never;
  onChange: (value: string) => void;
  value: string;
}

interface UncontrolledSelectFieldProps extends BaseSelectFieldProps {
  defaultValue?: string;
  onChange?: never;
  value?: never;
}

export type SelectFieldProps = ControlledSelectFieldProps | UncontrolledSelectFieldProps;
