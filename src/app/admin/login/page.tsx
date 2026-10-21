import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-guard";
import { AdminLoginView } from "@/components/admin/admin-login-view";

export const instant = false;

export const metadata = {
  title: "Admin Security Shield | Master Login",
  description: "Secure gateway for platform administrators.",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  return <AdminLoginView />;
}
