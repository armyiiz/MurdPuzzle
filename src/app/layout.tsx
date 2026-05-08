import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ไขคดีปริศนา | เกมสืบสวนตรรกะภาษาไทย",
  description: "เกม logic detective puzzle ภาษาไทยสำหรับมือถือ ไขคดีด้วยเบาะแส ตารางตรรกะ และสรุปรูปคดี",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ไขคดีปริศนา",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFDF5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th-TH" className="h-full antialiased">
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags -- Font Awesome is a local vendor stylesheet served from public. */}
        <link rel="stylesheet" href="/fontawesome/css/fontawesome.min.css" />
        {/* eslint-disable-next-line @next/next/no-css-tags -- Loading only the solid icon style keeps the previous icon rendering without all.min.css. */}
        <link rel="stylesheet" href="/fontawesome/css/solid.min.css" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
