"use client"

import { Button } from "../../components/ui/button"
import Link from "next/link"

export default function OrderFailedPage() {
  return (
    <div className="bg-red-50 min-h-screen px-6 md:px-16 lg:px-24 mb-12 flex flex-col items-center justify-center" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Oops! Something Went Wrong</h1>
        <p className="text-xl text-gray-700 mb-6">We encountered an issue while processing your order. Please try again or contact customer support for assistance.</p>
        <div className="flex justify-center">
          <Button variant="outline" size="lg" className="mr-4">
            <Link href="/cart">Go Back to Cart</Link>
          </Button>
          <Button size="lg">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
