"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/encomendas", label: "Encomendas", icon: "shopping_bag" },
  { href: "/admin/produtos", label: "Produtos", icon: "inventory_2" },
  { href: "/admin/categorias", label: "Categorias", icon: "category" },
  { href: "/admin/contabilidade", label: "Contabilidade", icon: "account_balance" },
  { href: "/admin/lancamento", label: "Lançamento", icon: "rocket_launch" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const navContent = (
    <>
      <div className="p-6">
        <Link href="/admin" className="block" onClick={() => setOpen(false)}>
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
            onClick={() => setOpen(false)}
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
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#1c1b1b] flex items-center justify-between px-4 py-3">
        <button onClick={() => setOpen(true)} className="text-white/70 p-1">
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <Image
          src="/images/logo.png"
          alt="Wepink"
          width={80}
          height={28}
          className="h-6 w-auto object-contain brightness-0 invert opacity-80"
        />
        <div className="w-9" />
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-[#1c1b1b] text-white z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute top-4 right-4">
          <button onClick={() => setOpen(false)} className="text-white/50 p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-[#1c1b1b] text-white z-40 flex-col">
        {navContent}
      </aside>
    </>
  );
}
