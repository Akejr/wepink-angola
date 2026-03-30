"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Product, CartItem } from "@/types/product";

interface CartContextType {
  items: CartItem[];
  addItem: (
    product: Product,
    size: { label: string; ml: number; price: number }
  ) => void;
  removeItem: (productId: string, sizeLabel: string) => void;
  updateQuantity: (
    productId: string,
    sizeLabel: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = useCallback(
    (
      product: Product,
      selectedSize: { label: string; ml: number; price: number }
    ) => {
      setItems((prev) => {
        const existing = prev.find(
          (item) =>
            item.product.id === product.id &&
            item.selectedSize.label === selectedSize.label
        );
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id &&
            item.selectedSize.label === selectedSize.label
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { product, selectedSize, quantity: 1 }];
      });
      setIsCartOpen(true);
    },
    []
  );

  const removeItem = useCallback(
    (productId: string, sizeLabel: string) => {
      setItems((prev) =>
        prev.filter(
          (item) =>
            !(
              item.product.id === productId &&
              item.selectedSize.label === sizeLabel
            )
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, sizeLabel: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, sizeLabel);
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId &&
          item.selectedSize.label === sizeLabel
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.selectedSize.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
