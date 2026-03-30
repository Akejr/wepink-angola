"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="cart-overlay fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-[60]"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="cart-panel fixed right-0 top-0 h-full w-full max-w-md bg-surface-container-lowest z-[70] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-2xl font-[family-name:var(--font-headline)] text-on-surface">
            Carrinho
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-on-surface hover:text-primary hover:rotate-90 transition-all duration-300 p-2"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center animate-fade-up">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-6">
              shopping_bag
            </span>
            <p className="text-secondary text-lg mb-2">
              O seu carrinho está vazio
            </p>
            <p className="text-outline text-sm">
              Descubra as nossas fragrâncias exclusivas
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 space-y-4">
              {items.map((item, i) => (
                <div
                  key={`${item.product.id}-${item.selectedSize.label}`}
                  className="flex gap-4 bg-surface-container-low p-4 rounded-lg animate-fade-up hover:bg-surface-container transition-colors duration-300"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="w-20 h-24 relative rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-[family-name:var(--font-headline)] text-on-surface text-sm">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-secondary">
                        {item.selectedSize.label}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize.label,
                              item.quantity - 1
                            )
                          }
                          className="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-on-surface hover:bg-secondary-container transition-all duration-200 active:scale-90 text-sm"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium w-6 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize.label,
                              item.quantity + 1
                            )
                          }
                          className="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-on-surface hover:bg-secondary-container transition-all duration-200 active:scale-90 text-sm"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-[family-name:var(--font-headline)] text-primary text-sm">
                          {formatPrice(
                            item.selectedSize.price * item.quantity
                          )}{" "}
                          Kz
                        </span>
                        <button
                          onClick={() =>
                            removeItem(
                              item.product.id,
                              item.selectedSize.label
                            )
                          }
                          className="text-outline hover:text-error hover:scale-110 transition-all duration-300"
                        >
                          <span className="material-symbols-outlined text-lg">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-surface-container-low space-y-4 animate-fade-up delay-200">
              <div className="flex justify-between items-center">
                <span className="text-secondary font-[family-name:var(--font-label)] text-sm">
                  Subtotal
                </span>
                <span className="font-[family-name:var(--font-headline)] text-xl text-primary">
                  {formatPrice(totalPrice)} Kz
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="btn-shine block w-full bg-primary text-on-primary py-4 rounded-lg font-bold text-sm tracking-widest uppercase text-center hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 active:scale-[0.98]"
              >
                Finalizar Compra
              </Link>
              <button
                onClick={() => setIsCartOpen(false)}
                className="block w-full text-center text-primary text-sm font-medium hover:underline underline-offset-4 transition-all duration-300"
              >
                Continuar Comprando
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
