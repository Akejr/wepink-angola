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
      <main className="pt-16 px-4 pb-8 lg:pt-0 lg:ml-64 lg:p-8">{children}</main>
    </div>
  );
}
