import { LucideBomb, LucideMail, Eye, EyeClosed } from "lucide-react";
import { useMemo, useState } from "react";

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
      <span className="text-field-border text-field-border--top-left"></span>
      <span className="text-field-border text-field-border--top-right"></span>
      <span className="text-field-border text-field-border--bottom-left"></span>
      <span className="text-field-border text-field-border--bottom-right"></span>
      <span className="text-field-border text-field-border--top"></span>
      <span className="text-field-border text-field-border--left"></span>
    </>
  );
};

const GlowBorders = () => {
  return (
    <>
      <span className="text-field-glow-border text-field-glow-border--top"></span>
      <span className="text-field-glow-border text-field-glow-border--center"></span>
      <span className="text-field-glow-border text-field-glow-border--bottom"></span>
    </>
  );
};

const Corners = () => {
  return (
    <>
      <span
        className="text-field-corner text-field-corner--top-left"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
      <span
        className="text-field-corner text-field-corner--top-right"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
      <span
        className="text-field-corner text-field-corner--bottom-left"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
      <span
        className="text-field-corner text-field-corner--bottom-right"
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
  ...restProps
}: TextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const id = useMemo(() => crypto.randomUUID(), []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={getClassName(className)} data-touched={touched}>
      <label className="text-field-label" htmlFor={id}>
        {label}
      </label>
      <Corners />
      <Borders />
      <GlowBorders />
      <div
        className={`relative ${touched ? "has-[.text-field-input:invalid]:[&+.text-field-error]:flex!" : ""}`}
      >
        <input
          className="text-field-input"
          id={id}
          onBlur={() => setTouched(true)}
          onChange={handleChange}
          style={{ clipPath: CLIP_PATH }}
          type={type === "password" && showPassword ? "text" : type}
          {...restProps}
        />
        {type === "email" && (
          <LucideMail className="text-field-icon pointer-events-none" size={20} />
        )}
        {type === "password" && (
          <button onClick={() => setShowPassword((prev) => !prev)} className="text-field-icon">
            {showPassword ? <Eye /> : <EyeClosed />}
          </button>
        )}
      </div>
      {Boolean(errorMessage) && (
        <div className="text-field-error">
          <LucideBomb name="error" size={12} />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
