import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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
  title: {
    default: "Urban Codetionary",
    template: "%s | Urban Codetionary",
  },
  description:
    "A community-style developer dictionary for coding slang, concepts, and technical terms.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetBrainsMono.variable}`}>
        <div className="app-shell">
          <header className="bootstrap-header">
            <div>
              <p className="bootstrap-header__eyebrow">developer dictionary</p>
              <h1>Urban Codetionary</h1>
            </div>
            <p className="bootstrap-header__copy">
              Building a durable and secure home for coding slang and technical
              language.
            </p>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
