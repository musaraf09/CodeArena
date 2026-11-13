import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code" });

export const metadata: Metadata = {
  title: {
    default: "CodeArena — Think. Code. Conquer.",
    template: "%s | CodeArena",
  },
  description:
    "Sharpen your coding skills with hands-on challenges, beginner-friendly learning paths, and real JavaScript execution. Free, focused, and built for your next level.",
  generator: "v0.app",
  icons: { icon: { url: "/codearena.svg", type: "image/svg+xml" } },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#090B13",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mono.variable} antialiased`}>
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <div id="content">{children}</div>
        <SiteFooter />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
