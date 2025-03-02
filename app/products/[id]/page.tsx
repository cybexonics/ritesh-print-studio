"use client";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { Button } from "../../components/ui/button";
import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { useCart } from "@/app/components/CartContext";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  images: string[];
  category: string;
  customizable: boolean;
  sizes?: string[];
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { addToCart } = useCart(); // Using cart context
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;

      try {
        setLoading(true);
        const res = await fetch(`https://ritesh-print-studio-server.vercel.app/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");

        const data: Product = await res.json();
        setProduct(data);
        if (data.images.length > 0) setSelectedImage(data.images[0]);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // Handle file upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add to cart function
  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    setIsAdding(true);
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: selectedImage || product.images[0],
      size: selectedSize,
      customText,
      customImage: uploadedImage,
    });
    alert("Added to cart!");
    setTimeout(() => setIsAdding(false), 1000);
  };

  if (loading) return <p className="text-center mt-20 text-lg">Loading product...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!product) return notFound();

  return (
    <div className="bg-white min-h-screen px-6 md:px-16 lg:px-24 mb-12 py-10">
      {/* Product Details */}
      <div className="container mx-auto grid md:grid-cols-2 gap-12">
        <div className="justify-center">
          <Image src={selectedImage || "/default-image.jpg"} alt={product.name} width={400} height={400} />
          {product.images.length > 1 && (
            <div className="flex mt-4 space-x-2 overflow-x-auto">
              {product.images.map((img, index) => (
                <button key={index} onClick={() => setSelectedImage(img)}>
                  <Image
                    src={img}
                    alt={`Variant ${index + 1}`}
                    width={50}
                    height={50}
                    className={`rounded border-2 ${selectedImage === img ? "border-black" : "border-transparent"}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-gray-900 mb-4">${product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {product.features.length > 0 && (
            <ul className="list-disc pl-5 text-gray-700 mb-6">
              {product.features.map((feature, index) => <li key={index} className="mb-2">{feature}</li>)}
            </ul>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Size:</h3>
              <RadioGroup value={selectedSize || ""} onValueChange={setSelectedSize}>
                <div className="flex space-x-2">
                  {product.sizes.map(size => (
                    <div key={size}>
                      <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                      <Label
                        htmlFor={`size-${size}`}
                        className={`px-3 py-1 border rounded cursor-pointer ${selectedSize === size ? "bg-black text-white" : "bg-white text-black"}`}
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {product.customizable && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Customization:</h3>
              <Textarea placeholder="Enter custom text here" value={customText} onChange={(e) => setCustomText(e.target.value)} />
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="w-full mt-2" />
            </div>
          )}

          {uploadedImage && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Uploaded Image:</h3>
              <Image src={uploadedImage} alt="Uploaded custom image" width={50} height={50} className="rounded-lg" />
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-4 mt-6">
            <Button size="lg" onClick={handleAddToCart} disabled={isAdding}>
              {isAdding ? "Adding..." : "Add to Cart"}
            </Button>
            <Button size="lg" variant="outline">Add to Wishlist</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
