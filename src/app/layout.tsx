import type { Metadata } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
import { PortfolioTourDock } from "@/components/saas/portfolio-tour-dock";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PristineClean | Premium Residential Cleaning Services",
  description:
    "Professional, bonded, and insured residential house cleaning services. Instant transparent quote and hassle-free online booking.",
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${cormorant.variable} h-full antialiased scroll-smooth overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden max-w-full">
        {children}
        <PortfolioTourDock />
      </body>
    </html>
  );
}
