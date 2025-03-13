"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"
import Modal from "@/app/components/ui/modal"
import { ProductAdd } from "@/app/components/product-form"

interface Product {
  _id: string
  name: string
  price: number | string
  description: string
  images: string[]
  category: string
  customizable: boolean
  sizes?: string[]
  features?: string[]
}

interface CategoryProductsClientProps {
  category: string
}

export function CategoryProductsClient({ category }: CategoryProductsClientProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Format category name for display
  const categoryName = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setMounted(true)
    fetchProducts()
  }, [category])

  async function fetchProducts() {
    try {
      setLoading(true)
      console.log(`Fetching products for category: ${category}`)

      // First try the category-specific endpoint
      const response = await fetch(`https://ritesh-print-studio-server.vercel.app/categories/${category}/products`)

      if (!response.ok) {
        // If category endpoint fails, fetch all products and filter
        console.log("Category endpoint failed, fetching all products")
        const allProductsResponse = await fetch("https://ritesh-print-studio-server.vercel.app/products")

        if (!allProductsResponse.ok) {
          throw new Error("Failed to fetch products")
        }

        const allProducts = await allProductsResponse.json()
        console.log("Filtering products by category:", category)
        const filteredProducts = allProducts.filter((product: Product) => product.category === category)
        setProducts(filteredProducts)
      } else {
        const data = await response.json()
        setProducts(data)
      }
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`https://ritesh-print-studio-server.vercel.app/products/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      setProducts(products.filter((product) => product._id !== id))
      alert("Product deleted successfully!")
    } catch (err) {
      console.error("Error deleting product:", err)
      setError("Failed to delete product")
    }
  }

  // Custom ProductAdd component that pre-selects the category
  const CategoryProductAdd = () => {
    return <ProductAdd defaultCategory={category} onSuccess={fetchProducts} />
  }

  // Show a consistent loading state during initial client-side render
  if (!mounted) {
    return (
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Loading {categoryName} Products...</h1>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Loading {categoryName} Products...</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage {categoryName} Products</h1>
        <div className="flex space-x-4">
          <Modal title={`Add ${categoryName} Product`}>
            <CategoryProductAdd />
          </Modal>
          <button
            onClick={() => router.push("/admin/dashboard/products")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600"
          >
            Back to All Products
          </button>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {products.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No {categoryName} products found. Add some products to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden border">
              <div className="relative h-48">
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
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">
                  ${typeof product.price === "number" ? product.price.toFixed(2) : Number(product.price).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center"
                    onClick={() => router.push(`/admin/dashboard/products/edit/${product._id}`)}
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center"
                    onClick={() => product._id && handleDeleteProduct(product._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

