import { Geist_Mono } from "next/font/google";

export const instant = false;

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className={`${geistMono.variable} min-h-screen bg-canvas text-text-primary`}>
      {children}
    </div>
  );
}
