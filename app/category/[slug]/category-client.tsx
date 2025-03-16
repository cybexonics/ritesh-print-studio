"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../../components/ui/button"

interface Product {
  _id: string
  name: string
  price: number | string
  description: string
  images: string[]
  category: string
}

interface CategoryClientProps {
  slug: string
}

export function CategoryClient({ slug }: CategoryClientProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchProductsByCategory() {
      try {
        setLoading(true)

        // First try to fetch from the categories endpoint
        const response = await fetch(`https://ritesh-print-studio-server.vercel.app/categories/${slug}/products`)

        // If the categories endpoint doesn't exist yet, try the regular products endpoint
        if (!response.ok) {
          console.log("Category products endpoint not available, fetching all products")
          const allProductsResponse = await fetch("https://ritesh-print-studio-server.vercel.app/products")

          if (!allProductsResponse.ok) {
            throw new Error("Failed to fetch products")
          }

          const allProducts = await allProductsResponse.json()
          // Filter products by category slug if possible
          const filteredProducts = allProducts.filter((product: Product) => product.category === slug)

          // If no products match the category, just show all products for now
          setProducts(filteredProducts.length > 0 ? filteredProducts : [])
          return
        }

        const data = await response.json()
        setProducts(data)
      } catch (err) {
        console.error("Error fetching category products:", err)
        setError("Could not load products for this category")
      } finally {
        setLoading(false)
      }
    }

    fetchProductsByCategory()
  }, [slug])

  const handleAddToCart = (product: Product) => {
    // Implement add to cart functionality
    console.log("Adding to cart:", product)
  }

  // Format the category name for display
  const categoryName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">No products found in this category.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-64 w-full">
              {/* Use a placeholder image if the product image is a local file path */}
              {product.images[0] && (product.images[0].startsWith("/") || product.images[0].includes(":\\")) ? (
                <Image src="/placeholder.svg?height=300&width=300" alt={product.name} fill className="object-cover" />
              ) : (
                <Image
                  src={product.images[0] || "/placeholder.svg?height=300&width=300"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">
                ₹{typeof product.price === "number" ? product.price.toFixed(2) : Number(product.price).toFixed(2)}
              </p>
              <div className="flex justify-between items-center">
                <Link href={`/products/${product._id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
                <Button onClick={() => handleAddToCart(product)}>Add to Cart</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

