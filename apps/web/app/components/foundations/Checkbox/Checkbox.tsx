"use client";

import { Check, LucideBomb } from "lucide-react";
import { useId } from "react";

import type { CheckboxProps } from "./Checkbox.types";
import type { ChangeEvent } from "react";
import "./Checkbox.css";

const BASE_CLASS_NAME = "checkbox group";

const getClassName = (className?: string): string => {
  if (!className) {
    return BASE_CLASS_NAME;
  }

  return `${BASE_CLASS_NAME} ${className}`;
};

export const Checkbox = ({
  className,
  errorMessage,
  label,
  onChange,
  id: providedId,
  "aria-describedby": ariaDescribedBy,
  ...restProps
}: CheckboxProps) => {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const errorMessageId = errorMessage ? `${id}-error` : undefined;
  const describedBy = [ariaDescribedBy, errorMessageId].filter(Boolean).join(" ");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.checked);
  };

  return (
    <div className={getClassName(className)}>
      <label className="checkbox__label" htmlFor={id}>
        <span className="checkbox__control">
          <input
            aria-describedby={describedBy || undefined}
            aria-errormessage={errorMessageId}
            aria-invalid={errorMessage ? true : undefined}
            className="checkbox__input peer"
            id={id}
            onChange={handleChange}
            type="checkbox"
            {...restProps}
          />
          <span aria-hidden="true" className="checkbox__indicator">
            <Check className="checkbox__icon" size={14} strokeWidth={3} />
          </span>
        </span>
        <span>{label}</span>
      </label>
      {Boolean(errorMessage) && (
        <div aria-live="polite" className="checkbox__error" id={errorMessageId}>
          <LucideBomb name="error" size={12} />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
