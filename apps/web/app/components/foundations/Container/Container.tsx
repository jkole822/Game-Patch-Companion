import { getClassName } from "@/lib/utils";

import { CLIP_PATH, CORNERS_CLIP_PATH } from "./Container.constants";

import type { ContainerProps } from "./Container.types";
import "./Container.css";

const Borders = () => {
  return (
    <>
      <span className="gpc-container__border gpc-container__border--top-left"></span>
      <span className="gpc-container__border gpc-container__border--top-right"></span>
      <span className="gpc-container__border gpc-container__border--bottom-left"></span>
      <span className="gpc-container__border gpc-container__border--bottom-right"></span>
    </>
  );
};

const Corners = () => {
  return (
    <>
      <span
        className="gpc-container__corner gpc-container__corner--top-left"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
      <span
        className="gpc-container__corner gpc-container__corner--top-right"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
      <span
        className="gpc-container__corner gpc-container__corner--bottom-left"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
      <span
        className="gpc-container__corner gpc-container__corner--bottom-right"
        style={{ clipPath: CORNERS_CLIP_PATH }}
      ></span>
    </>
  );
};

export const Container = ({ children, className, contentClassName }: ContainerProps) => {
  return (
    <div className={getClassName("gpc-container", className)}>
      <Corners />
      <div className="gpc-container__surface" style={{ clipPath: CLIP_PATH }}>
        <Borders />
      </div>
      <div className={getClassName("gpc-container__content", contentClassName)}>{children}</div>
    </div>
  );
};
