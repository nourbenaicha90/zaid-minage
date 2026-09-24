import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect(`/${locale}`);
  }

  return (
    <div className="flex min-h-screen bg-offwhite">
      <AdminSidebar locale={locale} />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
