import type { Metadata } from "next";
import { Geist, Geist_Mono, Syncopate } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE_URL } from "@/lib/links";
import WorldBackdrop from "@/components/world/WorldBackdrop";
import SmoothScroll from "@/components/system/SmoothScroll";
import Nav from "@/components/nav/Nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const syncopate = Syncopate({
  variable: "--font-syncopate",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const DESCRIPTION =
  "Sambhav Jain — Builder, Consultant, President, Creator. Tools, work and the trek so far.";

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syncopate.variable} antialiased`}
    >
      <body>
        <WorldBackdrop />
        <SmoothScroll />
        <Nav />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
