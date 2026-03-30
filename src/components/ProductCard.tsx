"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  offset?: boolean;
}

export function ProductCard({ product, offset = false }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes[product.sizes.length - 1]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Link
      href={`/produto/${product.slug}`}
      className={`group block ${offset ? "md:mt-8" : ""}`}
    >
      <div className="aspect-[4/5] bg-surface-container-lowest overflow-hidden rounded-lg mb-3 md:mb-6 relative">
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.badge && (
          <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded text-[8px] md:text-[10px] font-bold tracking-widest text-primary transition-transform duration-300 group-hover:scale-105">
            {product.badge}
          </div>
        )}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.03] transition-colors duration-500" />
      </div>
      <div className="flex justify-between items-start gap-1">
        <div className="min-w-0">
          <h3 className="text-sm md:text-xl font-[family-name:var(--font-headline)] text-on-surface group-hover:text-primary transition-colors duration-300 truncate">
            {product.name}
          </h3>
          <p className="text-xs md:text-sm text-secondary mb-2 md:mb-4 transition-colors duration-300 group-hover:text-on-surface-variant truncate">
            {product.subtitle} •{" "}
            {product.sizes[product.sizes.length - 1].label}
          </p>
          <p className="text-base md:text-2xl font-[family-name:var(--font-headline)] text-primary">
            {formatPrice(product.price)} AOA
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          className={`p-2 md:p-3 rounded-lg transition-all duration-300 active:scale-90 flex-shrink-0 ${
            added
              ? "bg-primary text-on-primary scale-110"
              : "bg-secondary-container text-on-secondary-container hover:bg-primary hover:text-on-primary hover:scale-110 hover:shadow-md hover:shadow-primary/10"
          }`}
        >
          <span className="material-symbols-outlined text-xl md:text-2xl transition-transform duration-300">
            {added ? "check" : "add_shopping_cart"}
          </span>
        </button>
      </div>
    </Link>
  );
}
