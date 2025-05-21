'use client'

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Trash2 } from "lucide-react";
import { useCart } from "@/app/components/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  // Calculate total price
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white min-h-screen px-6 md:px-16 lg:px-24 mb-12" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <p>
            Your cart is empty.
            <Link href="/products" className="text-blue-500 hover:underline">
              Continue shopping
            </Link>
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item, index) => (
  <div key={index} className="flex items-center space-x-4 border-b pb-4">
    <Image
      src={item.image}
      alt={item.name}
      width={100}
      height={100}
      className="rounded-md"
    />
    <div className="flex-grow flex flex-col">
      <h2 className="text-xl font-semibold">{item.name}</h2>
      <p className="text-gray-600">₹ {item.price} | Size: {item.size}</p>
    </div>
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => updateQuantity(index, item.quantity - 1)}
      >
        -
      </Button>
      <Input
        type="number"
        min="0"
        value={item.quantity}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          updateQuantity(index, Number.parseInt(e.target.value))
        }
        className="w-16 text-center"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => updateQuantity(index, item.quantity + 1)}
      >
        +
      </Button>
    </div>

    <Button
      variant="default"
      size="sm"
      onClick={() => removeFromCart(index)}
      className="flex items-center justify-center p-2"
    >
      <Trash2 className="h-5 w-5 text-red-500" />
    </Button>
  </div>
))}
            </div>
            <div className="mt-8 flex justify-between items-center">
              <p className="text-xl font-semibold">Total: ₹{total.toFixed(2)}</p>
              <Link href="/checkout">
                <Button size="lg" className="flex-1 bg-black hover:bg-gray-800 text-white py-5 rounded-xl font-medium transition-all duration-200">Proceed to Checkout</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
