import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteShell from "@/components/shell/SiteShell";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/links";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION =
  "Sambhav Jain — Builder, Consultant, President, Creator. Turning meh into memorable through storytelling.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sambhav Jain",
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Sambhav Jain",
    title: "Sambhav Jain",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Sambhav Jain",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body id="top" className="min-h-full flex flex-col">
        <SiteShell>{children}</SiteShell>
        <Analytics />
      </body>
    </html>
  );
}
