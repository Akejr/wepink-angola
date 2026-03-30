"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { getCategories, Category } from "@/lib/categories";
import { useState, useEffect } from "react";

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 glass-nav transition-all duration-500 ${
        scrolled ? "py-0 shadow-[0_0_32px_rgba(28,27,27,0.04)]" : "py-0"
      }`}
    >
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="transition-transform duration-300 hover:scale-[1.03] active:scale-95"
        >
          <Image
            src="/images/logo.png"
            alt="Wepink"
            width={120}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              href={`/#shop`}
              className={`nav-link font-[family-name:var(--font-label)] tracking-widest text-xs uppercase pb-1 transition-colors duration-300 ${
                index === 0
                  ? "nav-link-active text-primary"
                  : "text-secondary hover:text-primary"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-on-surface hover:text-primary transition-colors duration-300 p-2 hover:scale-110 active:scale-90 transform">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-on-surface hover:text-primary transition-colors duration-300 p-2 relative hover:scale-110 active:scale-90 transform"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-on-primary text-[10px] rounded-full flex items-center justify-center font-bold animate-scale-in">
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-on-surface p-2 hover:text-primary transition-colors duration-300"
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden bg-surface-container-lowest px-6 overflow-hidden transition-all duration-300 ease-out ${
          mobileMenuOpen
            ? "max-h-80 pb-6 opacity-100"
            : "max-h-0 pb-0 opacity-0"
        }`}
      >
        <div className="space-y-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/#shop`}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-secondary hover:text-primary transition-colors duration-300 font-[family-name:var(--font-label)] tracking-widest text-sm uppercase"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
