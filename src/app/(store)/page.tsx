"use client";

import { getProducts } from "@/lib/products";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { useScrollRevealAll } from "@/hooks/useScrollReveal";
import { useState, useEffect } from "react";

type FilterType = "all" | "floral" | "woody" | "citrus" | "oriental" | "fresh" | "gourmand";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  useScrollRevealAll();

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const filters: { label: string; value: FilterType }[] = [
    { label: "TODOS", value: "all" },
    { label: "FLORAL", value: "floral" },
    { label: "AMADEIRADO", value: "woody" },
    { label: "CÍTRICO", value: "citrus" },
    { label: "ORIENTAL", value: "oriental" },
  ];

  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.type === activeFilter);

  return (
    <main className="pt-[108px]">
      {/* Hero Banner */}
      <section className="w-full animate-fade-in">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/Banner.gif"
          alt="Wepink Angola - Perfumes e Body Splash Premium em Luanda"
          className="w-full h-auto block"
        />
      </section>

      {/* Product Gallery */}
      <section className="py-20 bg-background" id="shop">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4 reveal" data-reveal-delay="0">
            <div>
              <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-headline)] text-primary mb-2">
                Queridinhos da Wepink
              </h2>
              <p className="text-secondary font-[family-name:var(--font-body)]">
                Curadoria exclusiva de fragrâncias premium.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tighter transition-all duration-300 ${
                    activeFilter === filter.value
                      ? "bg-primary text-on-primary scale-105"
                      : "bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim hover:scale-105"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-20">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={i % 3 === 1 ? "md:mt-8" : ""}>
                  <div className="aspect-[4/5] bg-surface-container-low rounded-lg mb-4 md:mb-6 animate-pulse" />
                  <div className="space-y-2 md:space-y-3">
                    <div className="h-4 md:h-5 bg-surface-container-low rounded w-2/3 animate-pulse" />
                    <div className="h-3 md:h-4 bg-surface-container-low rounded w-1/2 animate-pulse" />
                    <div className="h-5 md:h-7 bg-surface-container-low rounded w-1/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-20">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="reveal"
                  data-reveal-delay={String(index * 100)}
                >
                  <ProductCard
                    product={product}
                    offset={index % 3 === 1}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


    </main>
  );
}
