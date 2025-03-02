"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Modal from "./ui/modal";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";

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
    if (value.trim() === "") return;
    setUpdateData((prev) => ({
      ...prev,
      [key]: [...prev[key], value],
    }));

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
            <Button className="mt-2">Confirm</Button>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export function ProductAdd() {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    images: [] as string[],
    customizable: false,
    category: "",
    features: [] as string[],
    sizes: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [tempInput, setTempInput] = useState({
    size: "",
    image: "",
    feature: "",
  });

  // Handle Input Changes
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCustomizableChange = () => {
    setNewProduct((prev) => ({
      ...prev,
      customizable: !prev.customizable,
    }));
  };
  // Handle Temp Input Change
  const handleTempInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempInput({ ...tempInput, [e.target.name]: e.target.value });
  };

  // Add Item to Array
  const handleArrayAdd = (
    key: "images" | "features" | "sizes",
    value: string
  ) => {
    if (value.trim() !== "") {
      setNewProduct((prev) => ({
        ...prev,
        [key]: [...prev[key], value],
      }));
      setTempInput({ ...tempInput, [key]: "" }); // Clear input after adding
    }
  };

  // Remove Item from Array
  const handleArrayRemove = (
    key: "images" | "features" | "sizes",
    index: number
  ) => {
    setNewProduct((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  // Submit New Product
  const handleAddProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://ritesh-print-studio-server.vercel.app/products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        }
      );

      if (!response.ok) throw new Error("Failed to add product");
      alert("Product added successfully!");
    } catch (err) {
      setError("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-row gap-4 w-full">
        {/* Input Fields */}
        <div className="flex-1 flex flex-col gap-3">
          <Input
            placeholder="Product Name"
            name="name"
            value={newProduct.name}
            onChange={handleInput}
          />
          <Input
            placeholder="Product Price"
            name="price"
            value={newProduct.price}
            onChange={handleInput}
          />
          <Input
            placeholder="Product Description"
            name="description"
            value={newProduct.description}
            onChange={handleInput}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="customizable"
              checked={newProduct.customizable}
              onChange={handleInput}
            />
            Customizable
          </label>
          {/* Add Image */}
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Add Image URL"
              name="image"
              value={tempInput.image}
              onChange={handleTempInputChange}
            />
            <Button onClick={() => handleArrayAdd("images", tempInput.image)}>
              Add
            </Button>
          </div>

          {/* Add Sizes */}
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Add Size"
              name="size"
              value={tempInput.size}
              onChange={handleTempInputChange}
            />
            <Button onClick={() => handleArrayAdd("sizes", tempInput.size)}>
              Add
            </Button>
          </div>

          {/* Add Features */}
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Add Feature"
              name="feature"
              value={tempInput.feature}
              onChange={handleTempInputChange}
            />
            <Button
              onClick={() => handleArrayAdd("features", tempInput.feature)}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Display Selected Data */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Sizes */}
          <h3 className="text-lg font-semibold">Sizes:</h3>
          <div className="flex flex-wrap gap-2">
            {newProduct.sizes.map((size, index) => (
              <div
                key={index}
                className="flex items-center gap-2 border px-3 py-1 rounded"
              >
                {size}
                <Button
                  onClick={() => handleArrayRemove("sizes", index)}
                  size="icon"
                >
                  ✖
                </Button>
              </div>
            ))}
          </div>

          {/* Images */}
          <h3 className="text-lg font-semibold">Images:</h3>
          <div className="flex flex-wrap gap-2">
            {newProduct.images.map((image, index) => (
              <div
                key={index}
                className="flex items-center gap-2 border px-3 py-1 rounded"
              >
                {image}
                <Button
                  onClick={() => handleArrayRemove("images", index)}
                  size="icon"
                >
                  ✖
                </Button>
              </div>
            ))}
          </div>

          {/* Features */}
          <h3 className="text-lg font-semibold">Features:</h3>
          <div className="flex flex-wrap gap-2">
            {newProduct.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 border px-3 py-1 rounded"
              >
                {feature}
                <Button
                  onClick={() => handleArrayRemove("features", index)}
                  size="icon"
                >
                  ✖
                </Button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleAddProduct}
            disabled={loading}
            variant="outline"
          >
            {loading ? "Adding..." : "Add Product"}
          </Button>

          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </>
  );
}
