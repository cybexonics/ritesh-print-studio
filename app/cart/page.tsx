"use client";

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
    <div className="bg-white min-h-screen px-6 md:px-16 lg:px-24 mb-12 py-10">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-lg">
            Your cart is empty.{" "}
            <Link href="/products" className="text-blue-500 hover:underline">
              Continue shopping
            </Link>
          </p>
        ) : (
          <>
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center border-b pb-4 space-x-6 p-4 rounded-lg shadow-sm"
                >
                  {/* Product Image */}
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded-md border"
                  />

                  {/* Product Details */}
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-600">
                      ${item.price.toFixed(2)} | Size: {item.size}
                    </p>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        item.quantity > 1 &&
                        updateQuantity(
                          item._id,
                          item.quantity - 1,
                          item.color || "",
                          item.size || ""
                        )
                      }
                      disabled={item.quantity <= 1}
                      className="px-3"
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateQuantity(
                          item._id,
                          Math.max(1, Number.parseInt(e.target.value)),
                          item.color || "",
                          item.size || ""
                        )
                      }
                      className="w-16 text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.quantity + 1,
                          item.color || "",
                          item.size || ""
                        )
                      }
                      className="px-3"
                    >
                      +
                    </Button>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      removeFromCart(item._id, item.color || "", item.size || "")
                    }
                    className="p-2"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Total & Checkout */}
            <div className="mt-8 flex justify-between items-center">
              <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
              <Link href="/checkout">
                <Button size="lg">Proceed to Checkout</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
