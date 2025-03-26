"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, ImageIcon, ArrowLeft, Save, Plus } from "lucide-react"
import { Button } from "./ui/button"

interface ProductFormProps {
  id?: string
  defaultCategory?: string
  onSuccess?: () => void
}

interface Product {
  _id?: string
  name: string
  price: number | string
  description: string
  features: string[]
  images: string[]
  category: string
  customizable: boolean
  sizes?: string[]
}

export default function UnifiedProductForm({ id, defaultCategory, onSuccess }: ProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<"add" | "edit">(id ? "edit" : "add")
  const [formData, setFormData] = useState<Product>({
    name: "",
    price: "",
    description: "",
    features: [],
    images: [""],
    category: defaultCategory || "",
    customizable: false,
    sizes: [],
  })

  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [addedProductId, setAddedProductId] = useState<string | null>(null)

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("https://ritesh-print-studio-server.vercel.app/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  // Update category when defaultCategory changes
  useEffect(() => {
    if (defaultCategory && mode === "add") {
      setFormData((prev) => ({
        ...prev,
        category: defaultCategory,
      }))
    }
  }, [defaultCategory, mode])

  // Fetch product data if in edit mode
  useEffect(() => {
    async function fetchProduct(productId: string) {
      try {
        setFetchLoading(true)
        const response = await fetch(`https://ritesh-print-studio-server.vercel.app/products/${productId}`)
        if (!response.ok) throw new Error("Failed to fetch product")

        const product = await response.json()

        // Ensure features and sizes are arrays
        const processedProduct = {
          ...product,
          features: Array.isArray(product.features) ? product.features : [],
          sizes: Array.isArray(product.sizes) ? product.sizes : [],
          images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [""],
        }

        setFormData(processedProduct)

        // Set image preview if product has images
        if (processedProduct.images && processedProduct.images.length > 0 && processedProduct.images[0]) {
          setImagePreview(processedProduct.images[0])
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(`Error fetching product: ${errorMessage}`)
      } finally {
        setFetchLoading(false)
      }
    }

    if (id) {
      fetchProduct(id)
      setMode("edit")
    } else if (addedProductId) {
      fetchProduct(addedProductId)
      setMode("edit")
    }
  }, [id, addedProductId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement
      setFormData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }))
    } else if (name === "features" || name === "sizes") {
      setFormData((prev) => ({
        ...prev,
        [name]: value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setImagePreview(result)

      // Update the images array
      setFormData((prev) => ({
        ...prev,
        images: [result],
      }))
    }
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const clearImage = () => {
    setImagePreview(null)
    setFormData((prev) => ({
      ...prev,
      images: [""],
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      features: [],
      images: [""],
      category: defaultCategory || "",
      customizable: false,
      sizes: [],
    })
    setImagePreview(null)
    setError("")
    setSuccess(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const switchToAddMode = () => {
    setMode("add")
    resetForm()
    setAddedProductId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Ensure features and sizes are arrays before submitting
      const dataToSubmit = {
        ...formData,
        features: Array.isArray(formData.features) ? formData.features : [],
        sizes: Array.isArray(formData.sizes) ? formData.sizes : [],
      }

      if (mode === "add") {
        // Add new product
        const response = await fetch("https://ritesh-print-studio-server.vercel.app/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        })

        if (!response.ok) {
          throw new Error("Failed to add product")
        }

        const newProduct = await response.json()
        setSuccess(true)
        setAddedProductId(newProduct._id)
        setMode("edit")

        // Update form with the returned product data including the ID
        // Ensure features and sizes are arrays
        setFormData({
          ...newProduct,
          features: Array.isArray(newProduct.features) ? newProduct.features : [],
          sizes: Array.isArray(newProduct.sizes) ? newProduct.sizes : [],
        })
      } else {
        // Update existing product
        const productId = id || addedProductId
        const response = await fetch(`https://ritesh-print-studio-server.vercel.app/products/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        })

        if (!response.ok) {
          throw new Error("Failed to update product")
        }

        const updatedProduct = await response.json()
        setSuccess(true)

        // Ensure features and sizes are arrays
        setFormData({
          ...updatedProduct,
          features: Array.isArray(updatedProduct.features) ? updatedProduct.features : [],
          sizes: Array.isArray(updatedProduct.sizes) ? updatedProduct.sizes : [],
        })
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Ensure features and sizes are arrays for the form inputs
  const features = Array.isArray(formData.features) ? formData.features : []
  const sizes = Array.isArray(formData.sizes) ? formData.sizes : []

  return (
    <div className="space-y-6">
      {/* Header with mode indicator */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{mode === "add" ? "Add New Product" : "Edit Product"}</h2>

        {mode === "edit" && (
          <Button type="button" variant="outline" onClick={switchToAddMode} className="flex items-center gap-2">
            <Plus size={16} />
            Add New Product
          </Button>
        )}
      </div>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>}

      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md">
          {mode === "add" ? "Product added successfully!" : "Product updated successfully!"}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Features (comma separated)</label>
              <input
                type="text"
                name="features"
                value={features.join(", ")}
                onChange={handleChange}
                className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Feature 1, Feature 2, Feature 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sizes (comma separated)</label>
              <input
                type="text"
                name="sizes"
                value={sizes.join(", ")}
                onChange={handleChange}
                className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="S, M, L, XL"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Product Image</label>
              <div className="mt-1 flex flex-col items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative w-full h-48 mb-4">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Product preview"
                      className="w-full h-full object-contain border rounded-md"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={triggerFileInput}
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <ImageIcon size={48} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload product image</p>
                  </div>
                )}

                <Button type="button" onClick={triggerFileInput} variant="outline" className="mt-2">
                  <Upload size={16} className="mr-2" />
                  {imagePreview ? "Change Image" : "Upload Image"}
                </Button>
              </div>
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="customizable"
                name="customizable"
                checked={formData.customizable}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="customizable" className="ml-2 block text-sm text-gray-700">
                Customizable Product
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {mode === "edit" && (
            <Button type="button" variant="outline" onClick={switchToAddMode} className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Add New Instead
            </Button>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                {mode === "add" ? "Adding..." : "Updating..."}
              </>
            ) : (
              <>
                {mode === "add" ? (
                  <>
                    <Plus size={16} />
                    Add Product
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Update Product
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

