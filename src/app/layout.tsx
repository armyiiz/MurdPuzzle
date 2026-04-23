import type { Metadata, Viewport } from "next";
import "@fontsource/special-elite";
import "./globals.css";

export const metadata: Metadata = {
  title: "Logic Detective Puzzle",
  description: "A mobile-friendly Logic Grid Puzzle game",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Murdle TH",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e293b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-special-elite">{children}</body>
    </html>
  );
}
