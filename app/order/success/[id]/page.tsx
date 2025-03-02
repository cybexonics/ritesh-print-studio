"use client"

import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function OrderSuccessPage() {
  // Simulate order number (this should be dynamically generated or passed from the order confirmation API)
  const {id } = useParams()

  return (
    <div className="bg-green-50 min-h-screen px-6 md:px-16 lg:px-24 mb-12 flex flex-col items-center justify-center" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Order Successfully Placed!</h1>
        
        <p className="text-xl text-gray-700 mb-6">
          Thank you for your purchase. Your order is being processed.
        </p>

        {/* Order Number Display */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800">Your Order Number: <span className="text-green-600">{id}</span></p>
          <p className="text-sm text-gray-600 mt-2">Please save this order number for future reference and order tracking.</p>
        </div>

        {/* Warning to save order number */}
        <div className="text-sm text-red-500 mb-6">
          <p>⚠️ Please save your order number carefully as you will need it to track your order.</p>
        </div>

        <div className="flex justify-center">
          <Button size="lg" className="mr-4">
            <Link href="/orders">View Order Details</Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
