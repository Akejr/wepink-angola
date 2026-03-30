"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"multicaixa" | "card">(
    "multicaixa"
  );

  const deliveryFee = 2500;
  const total = totalPrice + deliveryFee;

  if (items.length === 0) {
    return (
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <span className="material-symbols-outlined text-7xl text-outline-variant mb-6 block">
          shopping_cart
        </span>
        <h1 className="text-4xl font-[family-name:var(--font-headline)] text-primary mb-4">
          Carrinho Vazio
        </h1>
        <p className="text-secondary mb-8">
          Adicione produtos ao carrinho antes de finalizar a compra.
        </p>
        <Link
          href="/"
          className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
        >
          Explorar Fragrâncias
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left: Order Summary */}
        <div className="lg:col-span-5 space-y-12">
          <section>
            <h2 className="text-3xl font-[family-name:var(--font-headline)] text-primary mb-10">
              Resumo do Pedido
            </h2>
            <div className="bg-surface-container-lowest p-8 rounded-lg space-y-8">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize.label}`}
                  className="flex gap-6"
                >
                  <div className="w-32 h-40 bg-surface-container-low rounded overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between py-2">
                    <div>
                      <h3 className="text-xl font-[family-name:var(--font-headline)] text-on-surface">
                        {item.product.name}
                      </h3>
                      <p className="text-secondary font-[family-name:var(--font-label)] text-sm tracking-wide mt-1">
                        {item.product.subtitle} | {item.selectedSize.label}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-secondary mt-1">
                          Qtd: {item.quantity}
                        </p>
                      )}
                    </div>
                    <div className="font-[family-name:var(--font-headline)] text-lg text-primary">
                      {formatPrice(item.selectedSize.price * item.quantity)}{" "}
                      Kz
                    </div>
                  </div>
                </div>
              ))}

              {/* Price Breakdown */}
              <div className="pt-8 space-y-4" style={{ borderTop: '1px solid rgba(214, 194, 196, 0.15)' }}>
                <div className="flex justify-between text-secondary font-[family-name:var(--font-label)]">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)} Kz</span>
                </div>
                <div className="flex justify-between text-secondary font-[family-name:var(--font-label)]">
                  <span>Entrega (Luanda)</span>
                  <span>{formatPrice(deliveryFee)} Kz</span>
                </div>
                <div className="flex justify-between text-on-surface font-bold text-xl pt-4">
                  <span className="font-[family-name:var(--font-headline)]">
                    Total
                  </span>
                  <span className="font-[family-name:var(--font-headline)] text-primary">
                    {formatPrice(total)} Kz
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Brand Assurance */}
          <div className="p-6 bg-secondary-container/30 rounded-lg flex items-start gap-4">
            <span className="material-symbols-outlined text-primary">
              verified
            </span>
            <div>
              <p className="font-bold text-on-secondary-container text-sm">
                Garantia Wepink Angola
              </p>
              <p className="text-on-secondary-container/80 text-xs mt-1 leading-relaxed">
                Produtos 100% originais com entrega expressa em toda a província
                de Luanda.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Checkout Form */}
        <div className="lg:col-span-7 space-y-12">
          {/* Delivery Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h2 className="text-2xl font-[family-name:var(--font-headline)] text-on-surface">
                Dados de Entrega
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 space-y-1">
                <label className="font-[family-name:var(--font-label)] text-xs tracking-widest text-secondary uppercase">
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Como consta no BI"
                  className="w-full bg-surface-container-low border-0 border-b border-outline-variant/30 focus:ring-0 focus:border-primary px-0 py-3 transition-all placeholder:text-outline-variant text-on-surface"
                />
              </div>
              <div className="space-y-1">
                <label className="font-[family-name:var(--font-label)] text-xs tracking-widest text-secondary uppercase">
                  Telemóvel
                </label>
                <input
                  type="tel"
                  placeholder="+244 9XX XXX XXX"
                  className="w-full bg-surface-container-low border-0 border-b border-outline-variant/30 focus:ring-0 focus:border-primary px-0 py-3 transition-all placeholder:text-outline-variant text-on-surface"
                />
              </div>
              <div className="space-y-1">
                <label className="font-[family-name:var(--font-label)] text-xs tracking-widest text-secondary uppercase">
                  Município (Luanda)
                </label>
                <select className="w-full bg-surface-container-low border-0 border-b border-outline-variant/30 focus:ring-0 focus:border-primary px-0 py-3 transition-all text-on-surface">
                  <option>Belas</option>
                  <option>Cacuaco</option>
                  <option>Cazenga</option>
                  <option>Icolo e Bengo</option>
                  <option>Luanda</option>
                  <option>Quiçama</option>
                  <option>Kilamba Kiaxi</option>
                  <option>Talatona</option>
                  <option>Viana</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="font-[family-name:var(--font-label)] text-xs tracking-widest text-secondary uppercase">
                  Endereço Detalhado
                </label>
                <input
                  type="text"
                  placeholder="Rua, Prédio, Nº de Casa"
                  className="w-full bg-surface-container-low border-0 border-b border-outline-variant/30 focus:ring-0 focus:border-primary px-0 py-3 transition-all placeholder:text-outline-variant text-on-surface"
                />
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h2 className="text-2xl font-[family-name:var(--font-headline)] text-on-surface">
                Método de Pagamento
              </h2>
            </div>
            <div className="space-y-4">
              {/* Multicaixa Option */}
              <button
                onClick={() => setPaymentMethod("multicaixa")}
                className={`w-full p-6 rounded-xl flex items-center justify-between text-left transition-all ${
                  paymentMethod === "multicaixa"
                    ? "bg-surface-container-lowest border border-primary/20"
                    : "bg-surface-container-low/50 border border-transparent opacity-60"
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center">
                    <span
                      className={`material-symbols-outlined scale-125 ${
                        paymentMethod === "multicaixa"
                          ? "text-primary"
                          : "text-secondary"
                      }`}
                    >
                      account_balance
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">
                      Referência Multicaixa
                    </p>
                    <p className="text-secondary text-xs">
                      Pague em qualquer ATM ou App Bancária
                    </p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                  {paymentMethod === "multicaixa" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
              </button>

              {/* Card Option */}
              <button
                onClick={() => setPaymentMethod("card")}
                className={`w-full p-6 rounded-xl flex items-center justify-between text-left transition-all ${
                  paymentMethod === "card"
                    ? "bg-surface-container-lowest border border-primary/20"
                    : "bg-surface-container-low/50 border border-transparent opacity-60"
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center">
                    <span
                      className={`material-symbols-outlined ${
                        paymentMethod === "card"
                          ? "text-primary"
                          : "text-secondary"
                      }`}
                    >
                      credit_card
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">
                      Cartão de Crédito
                    </p>
                    <p className="text-secondary text-xs">
                      Visa / Mastercard / Elo
                    </p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center">
                  {paymentMethod === "card" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
              </button>
            </div>

            {/* Reference Notice */}
            <div className="p-6 border border-dashed border-outline-variant rounded-lg">
              <p className="text-sm text-secondary leading-relaxed italic">
                Ao clicar em confirmar, será gerada uma referência exclusiva
                para o seu pedido. A validade da referência é de 24 horas. O
                processamento inicia imediatamente após a confirmação do
                pagamento.
              </p>
            </div>
          </section>

          {/* Confirm Button */}
          <div className="pt-6">
            <button className="w-full bg-primary text-on-primary py-5 rounded-lg font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
              Confirmar Pedido
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <p className="text-center text-xs text-secondary mt-6 font-[family-name:var(--font-label)] tracking-wide">
              Pagamento 100% processado de forma segura por EMIS Angola.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
