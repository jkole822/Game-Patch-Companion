"use client";

import Image from "next/image";
import NextLink from "next/link";
import { useState } from "react";

import type { NavigationProps } from "./Navigation.types";

import { Button, Drawer, Link } from "@/components";

import "./Navigation.css";

export const Navigation = ({ cta, links }: NavigationProps) => {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  const filteredLinks =
    links?.filter(
      (link): link is { href: string; label: string } =>
        typeof link.href !== "undefined" && typeof link.label !== "undefined",
    ) || [];

  return (
    <nav className="navigation page-margins">
      <NextLink className="navigation__home" href="/" title="Home">
        <Image
          alt="Hearthstone"
          className="navigation__home-image"
          height={1024}
          preload
          src="/gpc-hearthstone.png"
          width={1024}
        />
      </NextLink>
      <ul className="navigation__link-list">
        {filteredLinks.map(({ label, href }) => (
          <li key={label}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
        {cta && (
          <li>
            <Button href={cta.href}>{cta.label}</Button>
          </li>
        )}
      </ul>
      <Drawer
        hideHeader
        open={mobileNavigationOpen}
        onOpenChange={setMobileNavigationOpen}
        title="Menu"
        trigger={
          <button className="navigation__mobile-menu-button group">
            <div className="navigation__mobile-menu-icon">
              <svg viewBox="0 0 32 32">
                <path
                  className="navigation__mobile-menu-icon-path navigation__mobile-menu-icon-path--top-bottom"
                  d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                ></path>
                <path className="navigation__mobile-menu-icon-path" d="M7 16 27 16"></path>
              </svg>
            </div>
          </button>
        }
      >
        <ul className="navigation__link-list navigation__link-list--mobile">
          {filteredLinks.map(({ label, href }) => (
            <li className="navigation__link-item navigation__link-item--mobile" key={label}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
          {cta && (
            <li>
              <Button className="navigation__link-cta navigation__link-cta--mobile" href={cta.href}>
                {cta.label}
              </Button>
            </li>
          )}
        </ul>
      </Drawer>
    </nav>
  );
};
