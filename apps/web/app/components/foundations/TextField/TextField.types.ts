import type { InputHTMLAttributes } from "react";

export type TextFieldValidationMessages = Partial<
  Record<
    | "badInput"
    | "patternMismatch"
    | "rangeOverflow"
    | "rangeUnderflow"
    | "stepMismatch"
    | "tooLong"
    | "tooShort"
    | "typeMismatch"
    | "valueMissing",
    string
  >
>;

interface BaseTextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "defaultValue" | "onChange" | "value"
> {
  errorMessage?: string;
  label: string;
  validationMessages?: TextFieldValidationMessages;
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
