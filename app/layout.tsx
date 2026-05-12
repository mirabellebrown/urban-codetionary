import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { env } from "@/lib/env";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Urban Codetionary",
    template: "%s | Urban Codetionary",
  },
  description:
    "A community-style developer dictionary for coding slang, concepts, and technical terms.",
  openGraph: {
    title: "Urban Codetionary",
    description:
      "A community-style developer dictionary for coding slang, concepts, and technical terms.",
    siteName: "Urban Codetionary",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Urban Codetionary",
    description:
      "A community-style developer dictionary for coding slang, concepts, and technical terms.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetBrainsMono.variable}`}>
        <SiteHeader />
        <div className="app-shell">
          <main className="site-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
