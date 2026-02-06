"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import type { RedeemItem, Product } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface RedeemContextType {
  basket: RedeemItem[];
  addToBasket: (product: Product, quantity?: number) => void;
  removeFromBasket: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearBasket: () => void;
  basketTotal: number;
  itemCount: number;
}

const RedeemContext = createContext<RedeemContextType | undefined>(undefined);

export function RedeemProvider({ children }: { children: ReactNode }) {
  const [basket, setBasket] = useState<RedeemItem[]>([]);
  const { toast } = useToast();

  const addToBasket = (product: Product, quantity = 1) => {
    setBasket(prevBasket => {
      const existingItem = prevBasket.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevBasket.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevBasket, { product, quantity }];
    });
    toast({
      title: "Added to Basket",
      description: `${product.name} has been added to your basket.`,
    });
  };

  const removeFromBasket = (productId: string) => {
    setBasket(prevBasket => prevBasket.filter(item => item.product.id !== productId));
    toast({
      title: "Item Removed",
      description: `The item has been removed from your basket.`,
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromBasket(productId);
      return;
    }
    setBasket(prevBasket =>
      prevBasket.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearBasket = () => {
    setBasket([]);
  }

  const basketTotal = basket.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const itemCount = basket.reduce((count, item) => count + item.quantity, 0);

  return (
    <RedeemContext.Provider value={{ basket, addToBasket, removeFromBasket, updateQuantity, clearBasket, basketTotal, itemCount }}>
      {children}
    </RedeemContext.Provider>
  );
}

export function useRedeem() {
  const context = useContext(RedeemContext);
  if (context === undefined) {
    throw new Error('useRedeem must be used within a RedeemProvider');
  }
  return context;
}
