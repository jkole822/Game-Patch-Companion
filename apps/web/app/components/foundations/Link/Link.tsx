import NextLink from "next/link";

import type { AnchorHTMLAttributes } from "react";

import { getClassName } from "@/lib/utils";

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
