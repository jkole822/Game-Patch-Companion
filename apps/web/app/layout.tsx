import { unstable_cache } from "next/cache";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { cookies } from "next/headers";

import { Navigation } from "@/components";
import { getCurrentUser } from "@/lib/auth";
import { sanity } from "@/lib/utils";

import type { SiteSettings } from "@cms/sanity.types";
import type { Metadata } from "next";
import "./globals.css";

const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  navLoggedIn,
  navLoggedOut
}`;

const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => sanity.fetch(siteSettingsQuery),
  ["site-settings-navigation"],
  { revalidate: 300 },
);

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Game Patch Companion",
  description: "A tool for tracking game patch releases and their content changes.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const authUser = await getCurrentUser(cookieStore);
  const isLoggedIn = Boolean(authUser);
  const siteSettingsResults = await getSiteSettings();
  const navLoggedIn = siteSettingsResults?.navLoggedIn;
  const navLoggedOut = siteSettingsResults?.navLoggedOut;
  const navigation = isLoggedIn ? navLoggedIn : navLoggedOut;
  const cmsNavigationLinks = navigation?.links ?? [];
  const hasAdminLink = cmsNavigationLinks.some((link) => link.href === "/admin");
  const navigationLinks = [
    ...cmsNavigationLinks,
    ...(authUser?.role === "admin" && !hasAdminLink ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {navigation && (
          <Navigation
            {...navigation}
            links={navigationLinks}
            logoutAction={isLoggedIn ? "/api/auth/logout" : undefined}
          />
        )}
        {children}
      </body>
    </html>
  );
}
