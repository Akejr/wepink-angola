import { Sidebar } from "@/components/admin/Sidebar";

export const metadata = {
  title: "Admin | Wepink Angola",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-container-low">
      <Sidebar />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
