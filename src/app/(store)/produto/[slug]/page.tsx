"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getProductBySlug, formatPrice } from "@/lib/products";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useScrollRevealAll } from "@/hooks/useScrollReveal";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  useScrollRevealAll();

  useEffect(() => {
    if (slug) {
      getProductBySlug(slug).then((data) => {
        setProduct(data);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="pt-[72px] pb-20">
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <div className="h-4 bg-surface-container-low rounded w-48 mb-12 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7">
              <div className="aspect-[4/5] bg-surface-container-low rounded-lg animate-pulse" />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="h-12 bg-surface-container-low rounded w-3/4 animate-pulse" />
              <div className="h-8 bg-surface-container-low rounded w-1/3 animate-pulse" />
              <div className="h-20 bg-surface-container-low rounded animate-pulse" />
              <div className="h-12 bg-surface-container-low rounded animate-pulse" />
              <div className="h-16 bg-surface-container-low rounded animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center animate-fade-up">
        <h1 className="text-4xl font-[family-name:var(--font-headline)] text-primary mb-4">
          Produto não encontrado
        </h1>
        <p className="text-secondary mb-8">
          O produto que procura não existe ou foi removido.
        </p>
        <Link
          href="/"
          className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
        >
          Voltar à Home
        </Link>
      </main>
    );
  }

  const selectedSize = product.sizes[selectedSizeIndex];

  const handleAddToCart = () => {
    addItem(product, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <main className="pt-[72px] pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="py-8 mb-4 animate-fade-in">
          <ol className="flex items-center space-x-2 text-xs font-[family-name:var(--font-label)] tracking-widest text-secondary uppercase">
            <li>
              <Link href="/" className="hover:text-primary transition-colors duration-300">
                Home
              </Link>
            </li>
            <li>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            </li>
            <li>
              <Link href="/#shop" className="hover:text-primary transition-colors duration-300">
                Fragrâncias
              </Link>
            </li>
            <li>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            </li>
            <li className="text-on-surface font-semibold">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 relative group animate-fade-up">
            <div className="aspect-[3/4] bg-surface-container-low overflow-hidden rounded-lg relative">
              <Image
                src={product.imageUrl}
                alt={product.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.02] transition-colors duration-500" />
            </div>
            {product.badge && (
              <div className="absolute top-6 left-6 bg-white/40 backdrop-blur-md px-4 py-2 rounded-lg animate-scale-in delay-300">
                <span className="text-primary font-[family-name:var(--font-label)] text-[10px] tracking-widest uppercase font-bold">
                  {product.badge}
                </span>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 lg:sticky lg:top-32">
            <div className="space-y-8">
              <div className="animate-fade-up delay-100">
                <h1 className="font-[family-name:var(--font-headline)] text-5xl md:text-6xl text-primary mb-4 leading-tight">
                  {product.name}
                </h1>
                <p className="font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                  {formatPrice(selectedSize.price)} AOA
                </p>
              </div>

              <div className="space-y-4 animate-fade-up delay-200">
                <h3 className="font-[family-name:var(--font-label)] text-xs tracking-widest uppercase text-secondary font-bold">
                  O Segredo da Fragrância
                </h3>
                <div className="text-on-surface-variant leading-relaxed text-base font-light space-y-3">
                  {product.description.split("\n").filter(Boolean).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="space-y-4 animate-fade-up delay-300">
                <h3 className="font-[family-name:var(--font-label)] text-xs tracking-widest uppercase text-secondary font-bold">
                  Selecione o Tamanho
                </h3>
                <div className="flex gap-4">
                  {product.sizes.map((size, index) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSizeIndex(index)}
                      className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all duration-300 active:scale-95 ${
                        selectedSizeIndex === index
                          ? "bg-primary text-on-primary shadow-md shadow-primary/15"
                          : "bg-secondary-container text-on-secondary-container hover:bg-outline-variant/20 hover:shadow-sm"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`animate-fade-up delay-400 w-full py-6 rounded-lg font-bold text-sm tracking-[0.2em] uppercase transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer btn-shine ${
                  addedToCart
                    ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                    : "signature-gradient text-on-primary hover:shadow-lg hover:shadow-primary/20"
                }`}
              >
                <span className="material-symbols-outlined text-xl transition-transform duration-300">
                  {addedToCart ? "check_circle" : "shopping_cart"}
                </span>
                {addedToCart ? "Adicionado!" : "Adicionar ao Carrinho"}
              </button>

              <div className="pt-8 animate-fade-up delay-500">
                <h3 className="font-[family-name:var(--font-label)] text-xs tracking-widest uppercase text-secondary font-bold mb-4">
                  Perfil Olfativo
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.scentProfile.map((scent) => (
                    <span
                      key={scent}
                      className="bg-secondary-fixed text-on-secondary-fixed px-4 py-2 rounded-full text-xs font-medium hover:bg-primary hover:text-on-primary transition-all duration-300 cursor-default"
                    >
                      {scent}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-12 p-6 bg-surface-container-low rounded-lg space-y-4 hover:bg-surface-container transition-colors duration-300">
                <div className="flex items-center gap-3 text-primary">
                  <span className="material-symbols-outlined">payments</span>
                  <h3 className="font-[family-name:var(--font-headline)] font-bold">
                    Pagamento Multicaixa
                  </h3>
                </div>
                <div className="text-sm text-on-surface-variant space-y-2">
                  <p className="flex gap-2">
                    <span className="font-bold text-primary">1.</span>{" "}
                    Selecione &quot;Pagamento por Referência&quot; no seu ATM ou App.
                  </p>
                  <p className="flex gap-2">
                    <span className="font-bold text-primary">2.</span> Insira a
                    entidade e referência geradas no checkout.
                  </p>
                  <p className="flex gap-2">
                    <span className="font-bold text-primary">3.</span>{" "}
                    Confirmação imediata após o pagamento.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    Seguro & Verificado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-32 bg-surface-container-low py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-surface-container-lowest p-10 rounded-xl space-y-6 reveal hover:shadow-[0_0_32px_rgba(28,27,27,0.04)] transition-shadow duration-500" data-reveal-delay="0">
              <h2 className="font-[family-name:var(--font-headline)] text-3xl text-primary">
                Arte da Perfumaria
              </h2>
              <p className="text-on-surface-variant leading-loose font-light italic">
                &quot;O {product.name} não é apenas um perfume, é uma joia
                líquida. Cada nota foi meticulosamente selecionada para evocar a
                sofisticação e o dinamismo da Luanda moderna.&quot;
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div>
                  <h4 className="font-bold text-sm mb-2">Longa Duração</h4>
                  <p className="text-xs text-secondary leading-relaxed">
                    {product.details.duration}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-2">Ingredientes Premium</h4>
                  <p className="text-xs text-secondary leading-relaxed">
                    {product.details.ingredients}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-primary text-on-primary p-10 rounded-xl flex flex-col justify-between min-h-[280px] reveal hover:shadow-lg hover:shadow-primary/15 transition-shadow duration-500" data-reveal-delay="150">
              <span className="material-symbols-outlined text-5xl opacity-50">auto_awesome</span>
              <div>
                <h3 className="font-[family-name:var(--font-headline)] text-2xl mb-4">
                  Entrega Grátis em Luanda
                </h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  Para pedidos superiores a 100.000 AOA, receba o seu perfume em
                  casa sem custos adicionais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
