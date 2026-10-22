import type { Metadata } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
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
      <body className="min-h-full flex flex-col overflow-x-hidden max-w-full">{children}</body>
    </html>
  );
}
