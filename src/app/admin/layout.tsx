import { Sidebar } from "@/components/admin/Sidebar";
import { AdminAuth } from "@/components/admin/AdminAuth";

export const metadata = {
  title: "Admin | Wepink Angola",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuth>
      <div className="min-h-screen bg-surface-container-low">
        <Sidebar />
        <main className="pt-16 px-4 pb-8 lg:pt-0 lg:ml-64 lg:p-8">{children}</main>
      </div>
    </AdminAuth>
  );
}
