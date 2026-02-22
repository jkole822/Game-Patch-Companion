import Link from "next/link";

import { BASE_CLASS_NAME, CLIP_PATH, CORNERS_CLIP_PATH } from "./Button.constants";

import type { ButtonProps } from "./Button.types";

import Spinner from "@/assets/spinner.svg?react";
import { getClassName } from "@/lib/utils";

import "./Button.css";

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
      <span className="button-glow-border button-glow-border--top"></span>
      <span className="button-glow-border button-glow-border--bottom"></span>
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
      <div className={getClassName(BASE_CLASS_NAME, className)}>
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

  const { children, className, disabled, loading, type = "button", ...restProps } = props;

  const isDisabled = disabled || loading;

  return (
    <div className={getClassName(BASE_CLASS_NAME, className)} data-disabled={isDisabled}>
      <Corners />
      <GlowBorders />
      <button
        className="button"
        disabled={isDisabled}
        style={{ clipPath: CLIP_PATH }}
        type={type}
        {...restProps}
      >
        {loading && <Spinner className="button-spinner" />}
        <Borders />
        {children}
      </button>
    </div>
  );
};
