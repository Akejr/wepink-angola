"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminProduct, getAdminProducts, deleteProduct } from "@/lib/admin";
import { formatPrice } from "@/lib/products";

const typeLabels: Record<string, string> = {
  floral: "Floral",
  woody: "Amadeirado",
  citrus: "Cítrico",
  oriental: "Oriental",
  fresh: "Fresh",
  gourmand: "Gourmand",
};

export default function ProductsListPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadProducts = () => {
    setLoading(true);
    getAdminProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (product: AdminProduct) => {
    if (!confirm(`Tem certeza que deseja excluir "${product.name}"?`)) return;
    setDeleting(product.id);
    const result = await deleteProduct(product.id);
    if (result.success) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      alert(`Erro ao excluir: ${result.error}`);
    }
    setDeleting(null);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      (p.categories?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-[family-name:var(--font-headline)] text-on-surface mb-1">
            Produtos
          </h1>
          <p className="text-secondary text-sm">
            {products.length} produto{products.length !== 1 && "s"}
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

      <div className="bg-surface-container-lowest rounded-xl p-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nome, tipo, categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-surface-container-low rounded-lg text-sm text-on-surface placeholder:text-outline-variant border-0 focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-surface-container-low rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">
              inventory_2
            </span>
            <p className="text-secondary">
              {search
                ? "Nenhum produto encontrado para esta busca."
                : "Nenhum produto cadastrado ainda."}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile: card list */}
            <div className="lg:hidden divide-y divide-surface-container-high/30">
              {filtered.map((product) => (
                <div key={product.id} className="p-4 flex gap-4">
                  <div
                    className="w-16 h-20 rounded-lg bg-surface-container-low bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${product.image_url})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-on-surface text-sm truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-secondary truncate">
                          {product.subtitle} &middot;{" "}
                          {typeLabels[product.type] || product.type}
                        </p>
                        {product.categories?.name && (
                          <p className="text-xs text-secondary">
                            {product.categories.name}
                          </p>
                        )}
                      </div>
                      {product.badge && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider bg-primary/10 text-primary flex-shrink-0">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="font-[family-name:var(--font-headline)] text-sm text-primary">
                          {formatPrice(product.price)} Kz
                        </span>
                        <span className="text-xs text-secondary ml-2">
                          Custo: {formatPrice(product.purchase_price || 0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/produtos/${product.id}`}
                          className="p-1.5 rounded-lg text-secondary hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deleting === product.id}
                          className="p-1.5 rounded-lg text-secondary hover:text-error disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined text-xl">
                            {deleting === product.id ? "hourglass_empty" : "delete"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <table className="hidden lg:table w-full">
              <thead>
                <tr className="border-b border-surface-container-high">
                  <th className="text-left text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary px-6 py-4">
                    Produto
                  </th>
                  <th className="text-left text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary px-6 py-4">
                    Tipo
                  </th>
                  <th className="text-left text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary px-6 py-4">
                    Categoria
                  </th>
                  <th className="text-right text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary px-6 py-4">
                    Preço Venda
                  </th>
                  <th className="text-right text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary px-6 py-4">
                    Preço Compra
                  </th>
                  <th className="text-right text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary px-6 py-4">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-surface-container-high/50 hover:bg-surface-container-low/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-14 rounded-lg bg-surface-container-low bg-cover bg-center flex-shrink-0"
                          style={{ backgroundImage: `url(${product.image_url})` }}
                        />
                        <div>
                          <p className="font-medium text-on-surface text-sm">{product.name}</p>
                          <p className="text-xs text-secondary">{product.subtitle}</p>
                        </div>
                        {product.badge && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider bg-primary/10 text-primary">
                            {product.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-on-surface">
                        {typeLabels[product.type] || product.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-secondary">
                        {product.categories?.name || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-[family-name:var(--font-headline)] text-sm text-primary">
                        {formatPrice(product.price)} Kz
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-secondary">
                        {formatPrice(product.purchase_price || 0)} Kz
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/produtos/${product.id}`}
                          className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-primary/5 transition-all duration-200"
                        >
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deleting === product.id}
                          className="p-2 rounded-lg text-secondary hover:text-error hover:bg-error/5 transition-all duration-200 disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined text-xl">
                            {deleting === product.id ? "hourglass_empty" : "delete"}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
