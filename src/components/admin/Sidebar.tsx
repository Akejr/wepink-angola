"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/produtos", label: "Produtos", icon: "inventory_2" },
  { href: "/admin/categorias", label: "Categorias", icon: "category" },
  { href: "/admin/contabilidade", label: "Contabilidade", icon: "account_balance" },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#1c1b1b] text-white z-40 flex flex-col">
      <div className="p-6">
        <Link href="/admin" className="block">
          <Image
            src="/images/logo.png"
            alt="Wepink"
            width={100}
            height={34}
            className="h-7 w-auto object-contain brightness-0 invert opacity-80"
          />
          <span className="block text-[10px] uppercase tracking-[0.3em] text-white/40 mt-1.5">
            Backoffice
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive(item.href)
                ? "bg-primary text-white"
                : "text-white/60 hover:bg-white/8 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/40 hover:bg-white/8 hover:text-white transition-all duration-200"
        >
          <span className="material-symbols-outlined text-xl">storefront</span>
          Ver Loja
        </Link>
      </div>
    </aside>
  );
}
