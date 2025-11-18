import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  pricePerMeter: number;
  meters: number;
  imageUrl: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, meters: number) => void;
  getTotalCost: () => number;
}

const CartContext = createContext(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item: CartItem) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => 
        c.id === item.id 
          ? { ...c, meters: c.meters + item.meters } 
          : c
      ));
    } else {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, meters: number) => {
    if (meters <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, meters } : item
      ));
    }
  };

  const getTotalCost = () => {
    return cart.reduce((total, item) => total + (item.pricePerMeter * item.meters), 0);
  };

  return (
    
      {children}
    
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};