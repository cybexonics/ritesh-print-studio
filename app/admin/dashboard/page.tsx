"use client"

import { useState, useEffect } from "react"
import Layout from "@/app/components/dashboardLayout"
import { ProductUpdate } from "@/app/components/product-form"
import Table from "@/app/components/ui/table"
import ProtectedRoute from "../auth/ProtectedRoute"
import Link from "next/link"
import { Shirt, Coffee, MousePointer, Droplet, PillIcon } from "lucide-react"

interface Product {
  _id: number
  name: string
  price: number
  description: string
  features: string[]
  images: string[]
  category: string
  customizable: boolean
  sizes?: string[]
}

// Category data
const categories = [
  { name: "T-shirts", slug: "t-shirts", icon: Shirt, color: "bg-blue-500" },
  { name: "Hoodies", slug: "hoodies", icon: Shirt, color: "bg-purple-500" },
  { name: "Mousepads", slug: "mousepads", icon: MousePointer, color: "bg-green-500" },
  { name: "Mugs", slug: "mugs", icon: Coffee, color: "bg-yellow-500" },
  { name: "Water Bottles", slug: "water-bottles", icon: Droplet, color: "bg-cyan-500" },
  { name: "Pillows", slug: "pillows", icon: PillIcon, color: "bg-pink-500" },
]

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    totalProducts: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchProducts()
    fetchStats()
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

  // Fetch dashboard stats
  async function fetchStats() {
    try {
      const response = await fetch("https://ritesh-print-studio-server.vercel.app/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  // Show loading state during initial client-side render
  if (!mounted) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl">Loading dashboard...</p>
        </div>
      </Layout>
    )
  }

  if (loading) {
    return (
      <Layout>
        <ProtectedRoute>
          <div className="flex justify-center items-center h-screen">
            <p className="text-xl">Loading products...</p>
          </div>
        </ProtectedRoute>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <ProtectedRoute>
          <div className="flex justify-center items-center h-screen">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        </ProtectedRoute>
      </Layout>
    )
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div>
          <div className="bg-gray-100 mb-5">
            {/* Header */}
            <header className="bg-white p-4 shadow rounded-lg mb-6">
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </header>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-white shadow rounded-lg">
                <h2 className="text-lg font-semibold">Total Products</h2>
                <p className="text-2xl font-bold">{stats.totalProducts || products.length}</p>
              </div>
              <div className="p-6 bg-white shadow rounded-lg">
                <h2 className="text-lg font-semibold">Total Orders</h2>
                <p className="text-2xl font-bold">{stats.totalOrders || 0}</p>
              </div>
              <div className="p-6 bg-white shadow rounded-lg">
                <h2 className="text-lg font-semibold">Total Customers</h2>
                <p className="text-2xl font-bold">{stats.totalCustomers || 0}</p>
              </div>
              <div className="p-6 bg-white shadow rounded-lg">
                <h2 className="text-lg font-semibold">Revenue</h2>
                <p className="text-2xl font-bold">${stats.totalRevenue?.toFixed(2) || "0.00"}</p>
              </div>
            </div>
          </div>

          {/* Category Cards */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Manage Products by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link href={`/admin/dashboard/products/${category.slug}`} key={category.slug}>
                  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className={`${category.color} p-3 rounded-full mr-4`}>
                        <category.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Manage {category.name.toLowerCase()} products</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                      Manage {category.name}
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Products Table */}
          <h2 className="text-xl font-bold mb-4">Recent Products</h2>
          <Table
            data={products.slice(0, 5).map((product) => ({
              ...product,
              modalContent: <ProductUpdate id={`${product._id}`} />,
            }))}
            columns={["name", "category", "price", "modalContent"]}
            title={"View"}
          />

          <div className="mt-4 text-center">
            <Link href="/admin/dashboard/products">
              <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">View All Products</button>
            </Link>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

