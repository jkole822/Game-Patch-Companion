"use client";

import { LucideBomb, LucideMail, Eye, EyeClosed } from "lucide-react";
import { useId, useState } from "react";

import { BASE_CLASS_NAME, CLIP_PATH, CORNERS_CLIP_PATH } from "./TextField.constants";

import type { TextFieldProps } from "./TextField.types";
import type { ChangeEvent } from "react";
import "./TextField.css";

const getClassName = (className?: string): string => {
  if (!className) {
    return BASE_CLASS_NAME;
  }

  return `${BASE_CLASS_NAME} ${className}`;
};

const Borders = () => {
  return (
    <>
      <span className="text-field__border text-field__border--top-left"></span>
      <span className="text-field__border text-field__border--top-right"></span>
      <span className="text-field__border text-field__border--bottom-left"></span>
      <span className="text-field__border text-field__border--bottom-right"></span>
      <span className="text-field__border text-field__border--top"></span>
      <span className="text-field__border text-field__border--left"></span>
    </>
  );
};

const GlowBorders = () => {
  return (
    <>
      <span className="text-field__glow-border text-field__glow-border--top"></span>
      <span className="text-field__glow-border text-field__glow-border--center"></span>
      <span className="text-field__glow-border text-field__glow-border--bottom"></span>
    </>
  );
};

const Corners = () => {
  return (
    <>
      <span
        className="text-field__corner text-field__corner--top-left"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
      <span
        className="text-field__corner text-field__corner--top-right"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
      <span
        className="text-field__corner text-field__corner--bottom-left"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
      <span
        className="text-field__corner text-field__corner--bottom-right"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
    </>
  );
};

export const TextField = ({
  className,
  errorMessage,
  label,
  onChange,
  type,
  validationMessages,
  id: providedId,
  "aria-describedby": ariaDescribedBy,
  ...restProps
}: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
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

  const getNativeValidationMessage = (input: HTMLInputElement) => {
    input.setCustomValidity("");

    const { validity } = input;

    if (validity.valid) {
      return "";
    }

    if (validity.valueMissing) {
      return validationMessages?.valueMissing ?? `${label} is required.`;
    }

    if (validity.typeMismatch) {
      return validationMessages?.typeMismatch ?? `Enter a valid ${label.toLowerCase()}.`;
    }

    if (validity.patternMismatch) {
      return validationMessages?.patternMismatch ?? `${label} format is invalid.`;
    }

    if (validity.tooLong) {
      return validationMessages?.tooLong ?? `${label} is too long.`;
    }

    if (validity.tooShort) {
      return validationMessages?.tooShort ?? `${label} is too short.`;
    }

    if (validity.rangeOverflow) {
      return validationMessages?.rangeOverflow ?? `${label} is too high.`;
    }

    if (validity.rangeUnderflow) {
      return validationMessages?.rangeUnderflow ?? `${label} is too low.`;
    }

    if (validity.stepMismatch) {
      return validationMessages?.stepMismatch ?? `${label} is not valid.`;
    }

    if (validity.badInput) {
      return validationMessages?.badInput ?? `${label} is not valid.`;
    }

    return input.validationMessage;
  };

  const updateNativeErrorMessage = (input: HTMLInputElement) => {
    const message = getNativeValidationMessage(input);

    input.setCustomValidity(message);
    setNativeErrorMessage(message);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;

    if (touched || nativeErrorMessage) {
      updateNativeErrorMessage(input);
    }

    onChange?.(input.value);
  };

  return (
    <div className={getClassName(className)} data-touched={touched}>
      <label className="text-field__label" htmlFor={id}>
        {label}
      </label>
      <Corners />
      <Borders />
      <GlowBorders />
      <div
        className={`text-field__input-wrapper ${touched ? "has-[.js-text-field-input:invalid]:[&+.js-text-field-error]:flex!" : ""}`}
      >
        <input
          aria-describedby={describedBy || undefined}
          aria-errormessage={errorMessageId}
          aria-invalid={isErrorVisible ? true : undefined}
          autoComplete="off"
          className="text-field__input js-text-field-input"
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
          type={type === "password" && showPassword ? "text" : type}
          {...restProps}
        />
        {type === "email" && (
          <LucideMail className="text-field__icon pointer-events-none" size={20} />
        )}
        {type === "password" && (
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="text-field__icon"
            onClick={() => setShowPassword((prev) => !prev)}
            type="button"
          >
            {showPassword ? <Eye /> : <EyeClosed />}
          </button>
        )}
      </div>
      {isErrorVisible && (
        <div
          aria-live="polite"
          className={`text-field__error js-text-field-error ${isExternalErrorVisible ? "flex!" : ""}`}
          id={errorMessageId}
        >
          <LucideBomb name="error" size={12} />
          <span>{resolvedErrorMessage}</span>
        </div>
      )}
    </div>
  );
};
