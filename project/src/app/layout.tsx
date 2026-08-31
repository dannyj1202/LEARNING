/**
 * NEXT.JS — Root layout (app/layout.tsx)
 * --------------------------------------
 * Wraps EVERY route in the app. Files here run on the server by default
 * (no "use client") because this file has no hooks or browser APIs.
 *
 * - metadata → sets <title> and SEO tags for the whole site
 * - {children} → whatever page.tsx renders for the current URL
 * - Layout stays mounted when you navigate between routes (shared shell)
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// next/font loads Google fonts at build time and injects CSS variables
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Next.js reads this export and injects <title> / <meta> into <head>
export const metadata: Metadata = {
  title: "Vehicle results",
  description: "Almosafer-style vehicle booking results — learning project",
};

// TS: LayoutProps<"/"> is a Next.js helper — types the layout for the root route
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      {/* children = the active page (/, /rides-lift, /rides, etc.) */}
      <body>{children}</body>
    </html>
  );
}
