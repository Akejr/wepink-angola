"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDashboardStats, DashboardStats } from "@/lib/admin";
import { formatPrice } from "@/lib/products";

const typeLabels: Record<string, string> = {
  floral: "Floral",
  woody: "Amadeirado",
  citrus: "Cítrico",
  oriental: "Oriental",
  fresh: "Fresh",
  gourmand: "Gourmand",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-[family-name:var(--font-headline)] text-on-surface mb-1">
            Dashboard
          </h1>
          <p className="text-secondary text-sm">Visão geral da Wepink Angola</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest p-6 rounded-xl h-32 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      label: "Produtos / Estoque",
      value: `${stats.totalProducts} / ${stats.totalStock} un.`,
      icon: "inventory_2",
      color: "text-primary",
      bg: "bg-primary/8",
    },
    {
      label: "Saldo Atual",
      value: `${formatPrice(stats.balance)} Kz`,
      icon: "account_balance_wallet",
      color: stats.balance >= 0 ? "text-blue-700" : "text-red-700",
      bg: stats.balance >= 0 ? "bg-blue-50" : "bg-red-50",
    },
    {
      label: "Total Vendido",
      value: `${formatPrice(stats.totalSold)} Kz`,
      icon: "payments",
      color: "text-green-700",
      bg: "bg-green-50",
    },
    {
      label: "Total Gasto",
      value: `${formatPrice(stats.totalExpenses)} Kz`,
      icon: "shopping_cart",
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-[family-name:var(--font-headline)] text-on-surface mb-1">
            Dashboard
          </h1>
          <p className="text-secondary text-sm">
            Visão geral da Wepink Angola
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="bg-primary text-on-primary px-4 lg:px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 flex-shrink-0"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span className="hidden sm:inline">Novo Produto</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-surface-container-lowest p-6 rounded-xl hover:shadow-[0_0_32px_rgba(28,27,27,0.04)] transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary">
                {card.label}
              </span>
              <div
                className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}
              >
                <span className={`material-symbols-outlined ${card.color}`}>
                  {card.icon}
                </span>
              </div>
            </div>
            <p className="text-lg lg:text-2xl font-[family-name:var(--font-headline)] text-on-surface break-all">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-[family-name:var(--font-headline)] text-on-surface">
              Produtos Recentes
            </h2>
            <Link
              href="/admin/produtos"
              className="text-primary text-sm font-medium hover:underline underline-offset-4"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/produtos/${product.id}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors duration-200"
              >
                <div
                  className="w-12 h-12 rounded-lg bg-surface-container-low bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${product.image_url})` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-on-surface text-sm truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-secondary">
                    {product.subtitle} &middot; {product.type}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-[family-name:var(--font-headline)] text-sm text-primary">
                    {formatPrice(product.price)} Kz
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="bg-surface-container-lowest p-6 rounded-xl">
          <h2 className="text-lg font-[family-name:var(--font-headline)] text-on-surface mb-6">
            Categorias
          </h2>
          <div className="space-y-4">
            {Object.entries(stats.typeCounts).map(([cat, count]) => {
              const percentage = (count / stats.totalProducts) * 100;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-on-surface font-medium">
                      {typeLabels[cat] || cat}
                    </span>
                    <span className="text-secondary">
                      {count} produto{count !== 1 && "s"}
                    </span>
                  </div>
                  <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
