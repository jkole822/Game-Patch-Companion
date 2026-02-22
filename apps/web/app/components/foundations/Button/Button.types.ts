import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type SharedButtonProps = {
  children: ReactNode;
  className?: string;
};

type LinkButtonProps = SharedButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & {
    href: string;
  };

type NativeButtonProps = SharedButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: undefined;
    loading?: boolean;
  };

export type ButtonProps = LinkButtonProps | NativeButtonProps;
