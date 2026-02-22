import Link from "next/link";

import { BASE_CLASS_NAME, CLIP_PATH, CORNERS_CLIP_PATH } from "./Button.constants";

import type { ButtonProps } from "./Button.types";

import "./Button.css";

const getClassName = (className?: string): string => {
  if (!className) {
    return BASE_CLASS_NAME;
  }

  return `${BASE_CLASS_NAME} ${className}`;
};

const Borders = () => {
  return (
    <>
      <span className="button-border button-border--top-left"></span>
      <span className="button-border button-border--top-right"></span>
      <span className="button-border button-border--bottom-left"></span>
      <span className="button-border button-border--bottom-right"></span>
    </>
  );
};

const GlowBorders = () => {
  return (
    <>
      <span className="button-glow-border button-glow-border--top--one"></span>
      <span className="button-glow-border button-glow-border--top--two"></span>
      <span className="button-glow-border button-glow-border--top--three"></span>
      <span className="button-glow-border button-glow-border--bottom--one"></span>
      <span className="button-glow-border button-glow-border--bottom--two"></span>
      <span className="button-glow-border button-glow-border--bottom--three"></span>
    </>
  );
};

const Corners = () => {
  return (
    <>
      <span
        className="button-corner button-corner--top-left"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
      <span
        className="button-corner button-corner--top-right"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
      <span
        className="button-corner button-corner--bottom-left"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
      <span
        className="button-corner button-corner--bottom-right"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
    </>
  );
};

export const Button = (props: ButtonProps) => {
  if ("href" in props && typeof props.href === "string") {
    const { children, className, href, rel, target, ...restProps } = props;
    const safeRel = target === "_blank" && !rel ? "noopener noreferrer" : rel;

    return (
      <div className={getClassName(className)}>
        <Corners />
        <GlowBorders />
        <Link
          className="button"
          href={href}
          rel={safeRel}
          style={{ clipPath: CLIP_PATH }}
          target={target}
          {...restProps}
        >
          <Borders />
          {children}
        </Link>
      </div>
    );
  }

  const { children, className, disabled, type = "button", ...restProps } = props;

  return (
    <div className={getClassName(className)} data-disabled={disabled}>
      <Corners />
      <GlowBorders />
      <button
        className="button"
        disabled={disabled}
        style={{ clipPath: CLIP_PATH }}
        type={type}
        {...restProps}
      >
        <Borders />
        {children}
      </button>
    </div>
  );
};
