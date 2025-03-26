"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Layout from "@/app/components/dashboardLayout"
import ProtectedRoute from "../../auth/ProtectedRoute"
import { Trash2, Edit, Plus } from "lucide-react"
import { Button } from "@/app/components/ui/button"

interface Product {
  _id: string
  name: string
  category: string
  price: number
}

// Category data
const categories = [
  { name: "T-shirts", slug: "t-shirts" },
  { name: "Hoodies", slug: "hoodies" },
  { name: "Mousepads", slug: "mousepads" },
  { name: "Mugs", slug: "mugs" },
  { name: "Water Bottles", slug: "water-bottles" },
  { name: "Pillows", slug: "pillows" },
]

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      console.log("Fetching from:", "https://ritesh-print-studio-server.vercel.app/products")

      fetch("https://ritesh-print-studio-server.vercel.app/products")
        .then((res) => res.json())
        .then((data) => {
          console.log("Success:", data)
          setProducts(data)
        })
        .catch((err) => console.error("Error:", err))
    } catch (err) {
      console.error("Fetch Error:", err)

      if (err instanceof Error) {
        setError(`Error fetching products: ${err.message}`)
      } else {
        setError("Unknown error occurred while fetching products.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle product deletion
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`https://ritesh-print-studio-server.vercel.app/products/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      // Remove the deleted product from the state
      setProducts(products.filter((product) => product._id !== id))
      alert("Product deleted successfully!")
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product. Please try again.")
    }
  }

  // Filter products by category if one is selected
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products

  if (loading)
    return (
      <Layout>
        <ProtectedRoute>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-3">Loading products...</p>
          </div>
        </ProtectedRoute>
      </Layout>
    )

  if (error)
    return (
      <Layout>
        <ProtectedRoute>
          <p className="text-center mt-20 text-red-500">{error}</p>
        </ProtectedRoute>
      </Layout>
    )

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">All Products</h1>
          <Link href="/admin/dashboard/products/add">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add New Product
            </Button>
          </Link>
        </div>

        {/* Category filter buttons */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Filter by Category:</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded ${
                selectedCategory === null ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-3 py-1 rounded ${
                  selectedCategory === category.slug ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category management links */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Manage by Category:</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link key={category.slug} href={`/admin/dashboard/products/${category.slug}`}>
                <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                  Manage {category.name}
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Category</th>
                <th className="py-2 px-4 border-b text-left">Price</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{product._id.substring(0, 8)}...</td>
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b">{product.category}</td>
                  <td className="py-2 px-4 border-b">
                    ${typeof product.price === "number" ? product.price.toFixed(2) : Number(product.price).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <Link href={`/admin/dashboard/products/edit/${product._id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Edit className="h-4 w-4" /> Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product._id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center p-8 bg-gray-50 rounded-lg mt-4">
            <p className="text-gray-500">No products found. Add some products to get started.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

