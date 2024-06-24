import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Exclusive Messenger",
  description: "Exclusive Messenger is a Chat Web-App that lets users to have conversations.",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className={`${inter.className} bg-gradient-to-bl from-fuchsia-200 via-white to-rose-200 bg-no-repeat bg-cover min-h-[100vh]`}>{children}</body>
    </html>
  );
}
