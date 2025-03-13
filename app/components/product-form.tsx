"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Modal from "./ui/modal";


export function ProductUpdate({ id }: { id: string }) {
  const [updateData, setUpdateData] = useState({
    name: "",
    price: "",
    description: "",
    images: [] as string[],
    customizable: false,
    category: "",
    features: [] as string[],
    sizes: [] as string[],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newFeature, setNewFeature] = useState("");

  // Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://ritesh-print-studio-server.vercel.app/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");

        const product = await response.json();
        setUpdateData(product);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(`Error fetching product: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle Input Changes
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle Customizable Toggle
  const handleCustomizableChange = () => {
    setUpdateData((prev) => ({
      ...prev,
      customizable: !prev.customizable,
    }));
  };

  // Add Items (Size, Image, Feature)
  const handleAdd = (key: "images" | "features" | "sizes", value: string) => {
    if(updateData.images.length === 1){
      console.log("ok")
    }else{
      if (value.trim() === "") return;
      setUpdateData((prev) => ({
        ...prev,
        [key]: [...prev[key], value],
      }));
    }

    // Clear input field
    if (key === "images") setNewImage("");
    if (key === "sizes") setNewSize("");
    if (key === "features") setNewFeature("");
  };

  // Remove Items (Size, Image, Feature)
  const handleRemove = (
    key: "images" | "features" | "sizes",
    index: number
  ) => {
    setUpdateData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  // Submit Updated Data
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://ritesh-print-studio-server.vercel.app/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update product");
      alert("Product updated successfully!");
    } catch (err) {
      setError("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://ritesh-print-studio-server.vercel.app/products/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id),
      });

      if (!response.ok) throw new Error("Failed to update product");
      alert("Product delete successfully!");
    } catch (err) {
      setError("Error deleteing product");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1 flex flex-col gap-3">
          <Input
            placeholder="Product Name"
            name="name"
            value={updateData.name}
            onChange={handleInput}
          />
          <Input
            placeholder="Product Price"
            name="price"
            value={updateData.price}
            onChange={handleInput}
          />
          <Input
            placeholder="Product Description"
            name="description"
            value={updateData.description}
            onChange={handleInput}
          />

          <Input
            placeholder="Product Category"
            name="category"
            value={updateData.category}
            onChange={handleInput}
          />

          {/* Customizable Checkbox */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={updateData.customizable}
              onChange={handleCustomizableChange}
            />
            Customizable
          </label>

          {/* Add Image */}
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Add Image"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
            />
            <Button onClick={() => handleAdd("images", newImage)}>Add</Button>
          </div>

          {/* Add Sizes */}
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Add Size"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
            />
            <Button onClick={() => handleAdd("sizes", newSize)}>Add</Button>
          </div>

          {/* Add Features */}
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Add Feature"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
            />
            <Button onClick={() => handleAdd("features", newFeature)}>
              Add
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {/* Sizes Display */}
          <h3 className="text-lg font-semibold">Sizes:</h3>
          <div className="flex flex-wrap gap-2">
            {updateData.sizes.map((size, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="px-3 py-1 border rounded">{size}</span>
                <Button onClick={() => handleRemove("sizes", index)} size="sm">
                  ❌
                </Button>
              </div>
            ))}
          </div>

          {/* Images Display */}
          <h3 className="text-lg font-semibold">Images:</h3>
          <div className="flex flex-wrap gap-2">
            {updateData.images.map((image, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="px-3 py-1 border rounded">{image}</span>
                <Button onClick={() => handleRemove("images", index)} size="sm">
                  ❌
                </Button>
              </div>
            ))}
          </div>

          {/* Features Display */}
          <h3 className="text-lg font-semibold">Features:</h3>
          <div className="flex flex-wrap gap-2">
            {updateData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="px-3 py-1 border rounded">{feature}</span>
                <Button
                  onClick={() => handleRemove("features", index)}
                  size="sm"
                >
                  ❌
                </Button>
              </div>
            ))}
          </div>

          {/* Update Button */}
          <Button onClick={handleUpdate} disabled={loading} variant={"outline"}>
            {loading ? "Updating..." : "Update Product"}
          </Button>

          {/* Delete Modal */}
          <Modal title="Delete">
            Are you sure you want to delete this product?
            <Button className="mt-2" onClick={()=>handleDelete()}>Confirm</Button>
          </Modal>
        </div>
      </div>
    </div>
  );
}


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

export function ProductAdd({ defaultCategory, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, "_id">>({
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
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])

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
    } else if (name === "images") {
      setFormData({ ...formData, [name]: [value] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("https://ritesh-print-studio-server.vercel.app/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to add product")
      }

      setSuccess(true)
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded">Product added successfully!</div>}

      <div>
        <label className="block mb-1">Product Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      {/* <div>
        <label className="block mb-1">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div> */}

      <div>
        <label className="block mb-1">Features (comma separated)</label>
        <input
          type="text"
          name="features"
          value={formData.features.join(", ")}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Feature 1, Feature 2, Feature 3"
        />
      </div>

      <div>
        <label className="block mb-1">Sizes (comma separated)</label>
        <input
          type="text"
          name="sizes"
          value={formData.sizes?.join(", ") || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="S, M, L, XL"
        />
      </div>

      <div>
        <label className="block mb-1">Image URL</label>
        <input
          type="text"
          name="images"
          value={formData.images[0]}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="customizable"
          name="customizable"
          checked={formData.customizable}
          onChange={handleChange}
          className="mr-2"
        />
        <label htmlFor="customizable">Customizable</label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  )
}


