"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type CartItem = {
  _id: string
  name: string
  price: number
  quantity: number
  image: string
  color?: string | null
  size?: string
  customText?: string
  customImage?: string | null
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string,color:string,size:string) => void
  updateQuantity: (id: string,quantity: number, color:string,size:string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart])

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      // Check if item exists with the same attributes (name, color, size, etc.)
      const existingItem = prevCart.find(
        (cartItem) =>
          cartItem.name === item.name &&
          cartItem.color === item.color &&
          cartItem.size === item.size &&
          cartItem.customText === item.customText &&
          cartItem.customImage === item.customImage
      )

      if (existingItem) {
        // If item exists, update quantity (increase by 1)
        return prevCart.map((cartItem) =>
          cartItem === existingItem
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }

      // If item doesn't exist, add it as a new item
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }


 const updateQuantity = (index: number, quantity: number) => {
  setCart((prevCart) => {
    const updatedCart = [...prevCart];
    updatedCart[index] = {
      ...updatedCart[index],
      quantity: Math.max(quantity, 1),
    };
    return updatedCart;
  });
};

const removeFromCart = (index: number) => {
  setCart((prevCart) => {
    const updatedCart = [...prevCart];
    updatedCart.splice(index, 1);
    return updatedCart;
  });
};




  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
