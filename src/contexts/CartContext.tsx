"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { CartItem } from "@/types/cart";
import {
  Product,
  ExtendedProduct,
  normalizeProductForCart,
} from "@/types/product";

// Union type for products that can be added to cart
type CartableProduct =
  | Product
  | ExtendedProduct
  | {
      id: number;
      name?: string;
      title?: string;
      description?: string;
      price: string | number;
      stock?: number;
      [key: string]: unknown;
    };

interface CartContextType {
  cartItems: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    product: CartableProduct,
    quantity: number,
    selectedVariant?: {
      id: number;
      price: string;
      option_values: Record<string, string>;
    } | null
  ) => void;
  removeFromCart: (productId: number, variantId?: number | null) => void;
  updateQuantity: (
    productId: number,
    quantity: number,
    variantId?: number | null
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem("nepdora_cart");
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Failed to load cart from localStorage", error);
      }
    };
    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("nepdora_cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = (
    product: CartableProduct,
    quantity: number,
    selectedVariant?: {
      id: number;
      price: string;
      option_values: Record<string, string>;
    } | null
  ) => {
    const normalizedProduct: Product = normalizeProductForCart(product);

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => {
        const productMatch = item.product.id === normalizedProduct.id;
        const variantMatch =
          (item.selectedVariant?.id || null) === (selectedVariant?.id || null);
        return productMatch && variantMatch;
      });

      if (existingItem) {
        return prevItems.map((item) => {
          const productMatch = item.product.id === normalizedProduct.id;
          const variantMatch =
            (item.selectedVariant?.id || null) ===
            (selectedVariant?.id || null);
          return productMatch && variantMatch
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        });
      }

      return [
        ...prevItems,
        {
          product: normalizedProduct,
          quantity,
          selectedVariant: selectedVariant || null,
        },
      ];
    });
    openCart();
  };

  const removeFromCart = (productId: number, variantId?: number | null) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => {
        const productMatch = item.product.id === productId;
        const variantMatch =
          (item.selectedVariant?.id || null) === (variantId || null);
        return !(productMatch && variantMatch);
      })
    );
  };

  const updateQuantity = (
    productId: number,
    quantity: number,
    variantId?: number | null
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const productMatch = item.product.id === productId;
        const variantMatch =
          (item.selectedVariant?.id || null) === (variantId || null);
        return productMatch && variantMatch ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.selectedVariant
      ? parseFloat(item.selectedVariant.price)
      : parseFloat(item.product.price);
    return total + price * item.quantity;
  }, 0);

  const value = {
    cartItems,
    isOpen,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isLoading: false, 
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
