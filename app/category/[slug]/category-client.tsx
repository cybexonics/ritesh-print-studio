
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

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
        const response = await fetch(`https://ritesh-print-studio-server.vercel.app/categories/${slug}/products`)

        if (!response.ok) {
          console.log("Category products endpoint not available, fetching all products")
          const allProductsResponse = await fetch("https://ritesh-print-studio-server.vercel.app/products")

          if (!allProductsResponse.ok) {
            throw new Error("Failed to fetch products")
          }

          const allProducts = await allProductsResponse.json()
          const filteredProducts = allProducts.filter((product: Product) => product.category === slug)

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

  const categoryName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 mt-20">
        <h1 className="text-4xl font-bold text-center mb-8">{categoryName}</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20 text-center">
        <h1 className="text-4xl font-bold mb-8">{categoryName}</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20 text-center">
        <h1 className="text-4xl font-bold mb-8">{categoryName}</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">No products found in this category.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pt-20">
      <h1 className="text-4xl font-bold text-center mb-12">{categoryName}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 group">
            <div className="relative w-full h-80">
              <Image
                src={product.images[0] || "/placeholder.svg?height=300&width=300"}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
            <div className="p-6 text-center">
              {/* Product Name (Hover Effect Added) */}
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-[#34A9DC] transition-colors">
                {product.name}
              </h2>
              
              {/* Product Price */}
              <p className="text-base font-bold text-[#2DD4BF] mt-1">
                ₹{typeof product.price === "number" ? product.price.toFixed(2) : Number(product.price).toFixed(2)}
             </p>

              {/* View Details Button with Requested Style */}
              <Link href={`/products/${product._id}`}>
               <span className="inline-flex items-center justify-center text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 w-full py-2.5 rounded-lg bg-gradient-to-r from-[#34A9DC] to-[#2DD4BF] text-white font-medium shadow-lg hover:shadow-cyan-400/50 transition-all hover:scale-105 duration-300 cursor-pointer mt-3">
                 View Details
              </span>
            </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
