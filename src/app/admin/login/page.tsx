import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-guard";
import { AdminLoginView } from "@/components/admin/admin-login-view";

export const instant = false;

export const metadata = {
  title: "Admin Security Shield | Master Login",
  description: "Secure gateway for platform administrators.",
};

async function AdminLoginGate() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  return <AdminLoginView />;
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <AdminLoginGate />
    </Suspense>
  );
}
