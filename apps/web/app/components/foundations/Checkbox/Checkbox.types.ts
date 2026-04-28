import type { InputHTMLAttributes } from "react";

interface BaseCheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "children" | "defaultChecked" | "onChange" | "type" | "value"
> {
  errorMessage?: string;
  label: string;
}

interface ControlledCheckboxProps extends BaseCheckboxProps {
  checked: boolean;
  defaultChecked?: never;
  onChange: (checked: boolean) => void;
}

interface UncontrolledCheckboxProps extends BaseCheckboxProps {
  checked?: never;
  defaultChecked?: boolean;
  onChange?: never;
}

export type CheckboxProps = ControlledCheckboxProps | UncontrolledCheckboxProps;
