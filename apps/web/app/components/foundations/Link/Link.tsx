import NextLink from "next/link";

import { getClassName } from "@/lib/utils";

import type { AnchorHTMLAttributes } from "react";
import "./Link.css";

export const Link = ({
  children,
  className,
  rel,
  target,
  ...restProps
}: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string }) => {
  const safeRel = target === "_blank" && !rel ? "noopener noreferrer" : rel;

  return (
    <NextLink
      className={getClassName("link", className)}
      rel={safeRel}
      target={target}
      {...restProps}
    >
      {children}
    </NextLink>
  );
};
