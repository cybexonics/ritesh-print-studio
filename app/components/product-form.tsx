"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, ImageIcon } from "lucide-react"
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

// Function to compress image before upload
const compressImage = async (file: File, maxSizeKB = 100): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        // Calculate the width and height, maintaining aspect ratio
        const maxSize = 800
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)

        // Get the data URL from canvas with reduced quality
        const dataUrl = canvas.toDataURL(file.type, 0.7)
        resolve(dataUrl)
      }
      img.onerror = (error) => reject(error)
    }
    reader.onerror = (error) => reject(error)
  })
}

export function ProductAdd({ defaultCategory, onSuccess }: ProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<Omit<Product, "_id">>({
    name: "",
    price: "",
    description: "",
    features: [],
    images: [],
    category: defaultCategory || "",
    customizable: false,
    sizes: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Update category when defaultCategory changes
  useEffect(() => {
    if (defaultCategory) {
      setFormData((prev) => ({
        ...prev,
        category: defaultCategory,
      }))
    }
  }, [defaultCategory])

  useEffect(() => {
    // Fetch categories for the dropdown
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement
      setFormData({ ...formData, [name]: checkbox.checked })
    } else if (name === "features" || name === "sizes") {
      setFormData({ ...formData, [name]: value.split(",").map((item) => item.trim()) })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)

    try {
      // Compress the image
      const compressedImage = await compressImage(file, 100)
      setImagePreview(compressedImage)
    } catch (error) {
      console.error("Error compressing image:", error)
      // Fallback to regular preview if compression fails
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const clearImage = () => {
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Create a copy of formData without the images
      const productData = { ...formData }

      // If we have an image preview, use it
      if (imagePreview) {
        productData.images = [imagePreview]
      }

      // Ensure the payload isn't too large
      const jsonPayload = JSON.stringify(productData)
      if (jsonPayload.length > 1000000) {
        // 1MB limit
        throw new Error("Image is too large. Please use a smaller image or compress it further.")
      }

      const response = await fetch("https://ritesh-print-studio-server.vercel.app/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonPayload,
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Failed to add product: ${response.status} ${errorData}`)
      }

      setSuccess(true)
      setFormData({
        name: "",
        price: "",
        description: "",
        features: [],
        images: [],
        category: defaultCategory || "",
        customizable: false,
        sizes: [],
      })
      setImagePreview(null)
      setImageFile(null)

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-4 rounded-md">Product added successfully!</div>}

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
              value={formData.features.join(", ")}
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
              value={formData.sizes?.join(", ") || ""}
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
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

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

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm"
        >
          {loading ? "Adding..." : "Add Product"}
        </Button>
      </div>
    </form>
  )
}

// Updated ProductUpdate component with proper JSX return
export function ProductUpdate({ id }: ProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [updateData, setUpdateData] = useState<Product>({
    name: "",
    price: "",
    description: "",
    images: [],
    customizable: false,
    category: "",
    features: [],
    sizes: [],
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  // Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://ritesh-print-studio-server.vercel.app/products/${id}`)
        if (!response.ok) throw new Error("Failed to fetch product")

        const product = await response.json()
        setUpdateData(product)

        // Set image preview if product has images
        if (product.images && product.images.length > 0) {
          setImagePreview(product.images[0])
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(`Error fetching product: ${errorMessage}`)
      } finally {
        setLoading(false)
      }
    }

    // Fetch categories
    const fetchCategories = async () => {
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

    if (id) {
      fetchProduct()
      fetchCategories()
    }
  }, [id])

  // Handle Input Changes
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement
      setUpdateData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }))
    } else if (name === "features" || name === "sizes") {
      setUpdateData((prev) => ({
        ...prev,
        [name]: value.split(",").map((item) => item.trim()),
      }))
    } else {
      setUpdateData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Compress the image
      const compressedImage = await compressImage(file, 100)
      setImagePreview(compressedImage)

      // Update the images array
      setUpdateData((prev) => ({
        ...prev,
        images: [compressedImage],
      }))
    } catch (error) {
      console.error("Error compressing image:", error)
      // Fallback to regular preview if compression fails
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setUpdateData((prev) => ({
          ...prev,
          images: [result],
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const clearImage = () => {
    setImagePreview(null)
    setUpdateData((prev) => ({
      ...prev,
      images: [],
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Submit Updated Data
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateLoading(true)
    setUpdateSuccess(false)

    try {
      // Ensure the payload isn't too large
      const jsonPayload = JSON.stringify(updateData)
      if (jsonPayload.length > 1000000) {
        // 1MB limit
        throw new Error("Image is too large. Please use a smaller image or compress it further.")
      }

      const response = await fetch(`https://ritesh-print-studio-server.vercel.app/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: jsonPayload,
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Failed to update product: ${response.status} ${errorData}`)
      }

      setUpdateSuccess(true)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setUpdateLoading(false)
    }
  }

  if (loading) return <p className="text-center py-4">Loading product...</p>
  if (error) return <p className="text-center py-4 text-red-500">{error}</p>

  return (
    <form onSubmit={handleUpdate} className="space-y-6">
      {error && <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>}
      {updateSuccess && <div className="bg-green-100 text-green-700 p-4 rounded-md">Product updated successfully!</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              value={updateData.name}
              onChange={handleInput}
              required
              className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={updateData.price}
              onChange={handleInput}
              required
              className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={updateData.category}
              onChange={handleInput}
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
              value={updateData.features.join(", ")}
              onChange={handleInput}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sizes (comma separated)</label>
            <input
              type="text"
              name="sizes"
              value={updateData.sizes?.join(", ") || ""}
              onChange={handleInput}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={updateData.description}
              onChange={handleInput}
              required
              className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Product Image</label>
            <div className="mt-1 flex flex-col items-center">
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

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
              id="update-customizable"
              name="customizable"
              checked={updateData.customizable}
              onChange={handleInput}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="update-customizable" className="ml-2 block text-sm text-gray-700">
              Customizable Product
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={updateLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm"
        >
          {updateLoading ? "Updating..." : "Update Product"}
        </Button>
      </div>
    </form>
  )
}

