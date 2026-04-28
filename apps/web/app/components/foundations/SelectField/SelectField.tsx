"use client";

import { ChevronDown, LucideBomb } from "lucide-react";
import { useId, useState } from "react";

import { BASE_CLASS_NAME, CLIP_PATH, CORNERS_CLIP_PATH } from "./SelectField.constants";

import type { SelectFieldProps } from "./SelectField.types";
import type { ChangeEvent } from "react";
import "./SelectField.css";

const getClassName = (className?: string): string => {
  if (!className) {
    return BASE_CLASS_NAME;
  }

  return `${BASE_CLASS_NAME} ${className}`;
};

const Borders = () => {
  return (
    <>
      <span className="select-field__border select-field__border--top-left"></span>
      <span className="select-field__border select-field__border--top-right"></span>
      <span className="select-field__border select-field__border--bottom-left"></span>
      <span className="select-field__border select-field__border--bottom-right"></span>
      <span className="select-field__border select-field__border--top"></span>
      <span className="select-field__border select-field__border--left"></span>
    </>
  );
};

const GlowBorders = () => {
  return (
    <>
      <span className="select-field__glow-border select-field__glow-border--top"></span>
      <span className="select-field__glow-border select-field__glow-border--center"></span>
      <span className="select-field__glow-border select-field__glow-border--bottom"></span>
    </>
  );
};

const Corners = () => {
  return (
    <>
      <span
        className="select-field__corner select-field__corner--top-left"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
      <span
        className="select-field__corner select-field__corner--top-right"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
      <span
        className="select-field__corner select-field__corner--bottom-left"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
      <span
        className="select-field__corner select-field__corner--bottom-right"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
    </>
  );
};

export const SelectField = ({
  children,
  className,
  errorMessage,
  label,
  onChange,
  validationMessages,
  id: providedId,
  "aria-describedby": ariaDescribedBy,
  ...restProps
}: SelectFieldProps) => {
  const [touched, setTouched] = useState(false);
  const [nativeErrorMessage, setNativeErrorMessage] = useState("");
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const isExternalErrorVisible = Boolean(errorMessage);
  const isNativeErrorVisible = touched && Boolean(nativeErrorMessage);
  const isErrorVisible = isExternalErrorVisible || isNativeErrorVisible;
  const resolvedErrorMessage = errorMessage ?? nativeErrorMessage;
  const errorMessageId = isErrorVisible ? `${id}-error` : undefined;
  const describedBy = [ariaDescribedBy, errorMessageId].filter(Boolean).join(" ");

  const updateNativeErrorMessage = (select: HTMLSelectElement) => {
    const message = select.validity.valueMissing
      ? (validationMessages?.valueMissing ?? `${label} is required.`)
      : "";

    select.setCustomValidity(message);
    setNativeErrorMessage(message);
  };

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const select = event.target as HTMLSelectElement;

    if (touched || nativeErrorMessage) {
      updateNativeErrorMessage(select);
    }

    onChange?.(select.value);
  };

  return (
    <div className={getClassName(className)} data-touched={touched}>
      <label className="select-field__label" htmlFor={id}>
        {label}
      </label>
      <Corners />
      <Borders />
      <GlowBorders />
      <div
        className={`select-field__select-wrapper ${touched ? "has-[.js-select-field-select:invalid]:[&+.js-select-field-error]:flex!" : ""}`}
      >
        <select
          aria-describedby={describedBy || undefined}
          aria-errormessage={errorMessageId}
          aria-invalid={isErrorVisible ? true : undefined}
          className="select-field__select js-select-field-select"
          id={id}
          onBlur={(event) => {
            setTouched(true);
            updateNativeErrorMessage(event.target);
          }}
          onChange={handleChange}
          onInvalid={(event) => {
            setTouched(true);
            updateNativeErrorMessage(event.currentTarget);
          }}
          style={{ clipPath: CLIP_PATH }}
          {...restProps}
        >
          {children}
        </select>
        <ChevronDown className="select-field__icon" size={20} />
      </div>
      {isErrorVisible && (
        <div
          aria-live="polite"
          className={`select-field__error js-select-field-error ${isExternalErrorVisible ? "flex!" : ""}`}
          id={errorMessageId}
        >
          <LucideBomb name="error" size={12} />
          <span>{resolvedErrorMessage}</span>
        </div>
      )}
    </div>
  );
};
