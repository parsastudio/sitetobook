export const instant = false;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      {children}
    </div>
  );
}
