"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface Category {
  _id?: string
  name: string
  slug: string
  image: string
  count?: string
}

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://ritesh-print-studio-server.vercel.app/categories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      setError("Error fetching categories")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const response = await fetch(`https://ritesh-print-studio-server.vercel.app/categories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete category")

      // Refresh the category list
      fetchCategories()
    } catch (err) {
      setError("Error deleting category")
    }
  }

  if (loading) return <p>Loading categories...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category._id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-gray-500">Slug: {category.slug}</p>
                {category.count && <p className="text-gray-500">{category.count}</p>}
              </div>
              <div className="flex space-x-2">
                <CategoryEdit category={category} onUpdate={fetchCategories} />
                <Button variant="destructive" size="sm" onClick={() => handleDelete(category._id!)}>
                  Delete
                </Button>
              </div>
            </div>
            {category.image && (
              <div className="mt-2">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="h-32 w-full object-cover rounded-md"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <CategoryAdd onAdd={fetchCategories} />
    </div>
  )
}

function CategoryEdit({ category, onUpdate }: { category: Category; onUpdate: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<Category>({
    name: "",
    slug: "",
    image: "",
    count: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        image: category.image,
        count: category.count || "",
      })
    }
  }, [category])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`https://ritesh-print-studio-server.vercel.app/categories/${category._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update category")

      setIsOpen(false)
      onUpdate()
    } catch (err) {
      console.error("Error updating category:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        Edit
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Category</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <Input name="slug" value={formData.slug} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <Input name="image" value={formData.image} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Count (optional)</label>
                <Input name="count" value={formData.count} onChange={handleChange} />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

function CategoryAdd({ onAdd }: { onAdd: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<Category>({
    name: "",
    slug: "",
    image: "",
    count: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("https://ritesh-print-studio-server.vercel.app/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to add category")

      setIsOpen(false)
      setFormData({
        name: "",
        slug: "",
        image: "",
        count: "",
      })
      onAdd()
    } catch (err) {
      console.error("Error adding category:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="mt-4">
        Add New Category
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Category</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <Input name="slug" value={formData.slug} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <Input name="image" value={formData.image} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Count (optional)</label>
                <Input name="count" value={formData.count} onChange={handleChange} />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

