import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { cookies } from "next/headers";

import { Navigation } from "@/components";
import { sanity } from "@/lib/utils";

import type { SiteSettings } from "@cms/sanity.types";
import type { Metadata } from "next";
import "./globals.css";

const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  navLoggedIn,
  navLoggedOut
}`;

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
  const isLoggedIn = Boolean(cookieStore.get("auth_token")?.value);
  const siteSettingsResults: SiteSettings = await sanity.fetch(siteSettingsQuery);
  const navLoggedIn = siteSettingsResults?.navLoggedIn;
  const navLoggedOut = siteSettingsResults?.navLoggedOut;
  const navigation = isLoggedIn ? navLoggedIn : navLoggedOut;

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {navigation && <Navigation {...navigation} />}
        {children}
      </body>
    </html>
  );
}
