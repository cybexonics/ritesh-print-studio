"use client";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "../../components/ui/button";
import { useState, useEffect, ChangeEvent } from "react";
import { useParams } from "next/navigation";
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { addToCart } = useCart(); // Moved up to follow Rules of Hooks
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Fetch products data
  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("Fetching from:", "https://ritesh-print-studio-server.vercel.app/products");

        fetch("https://ritesh-print-studio-server.vercel.app/products")
          .then((res) => res.json())
          .then((data) => {
            console.log("Success:", data)
            setProducts(data)
          })
          .catch((err) => console.error("Error:", err));

      } catch (err) {
        console.error("Fetch Error:", err);

        if (err instanceof Error) {
          setError(`Error fetching products: ${err.message}`);
        } else {
          setError("Unknown error occurred while fetching products.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Get current product
  const product = products.find((p) => p._id === id);
  
  // Set initial selected image when product data loads
  useEffect(() => {
    // Only run if product exists and has images
    if (product && Array.isArray(product.images) && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

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
      image: selectedImage || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "/default-image.jpg"),
      color: selectedImage || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "/default-image.jpg"),
      size: selectedSize,
      customText,
      customImage: uploadedImage,
    });
    alert("Added to cart!");
    setTimeout(() => setIsAdding(false), 1000);
  };

  if (loading) {
    return <p className="text-center mt-20 text-lg">Loading products...</p>;
  }
  
  if (error) {
    return <p className="text-center mt-20 text-red-500">{error}</p>;
  }
  
  if (!product) {
    return notFound();
  }

  // Now that we have the product and verified it exists, we can safely use it
  const productImages = Array.isArray(product.images) ? product.images : [];
  const defaultImage = productImages.length > 0 ? productImages[0] : "/default-image.jpg";

  return (
    <div
      className="bg-white min-h-screen px-6 md:px-16 lg:px-24 mb-12"
      style={{ paddingTop: "100px", paddingBottom: "100px" }}
    >
      {/* Product Details */}
      <div className="container mx-auto grid md:grid-cols-2 gap-12">
        <div className="justify-center">
          <Image
            src={selectedImage || defaultImage}
            alt={product.name}
            width={400}
            height={400}
          />
          {productImages.length > 1 && (
            <div className="flex mt-4 space-x-2 overflow-x-auto">
              {productImages.map((img, index) => (
                <button key={index} onClick={() => setSelectedImage(img)}>
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`Variant ${index + 1}`}
                    width={50}
                    height={50}
                    className={`rounded border-2 ${
                      selectedImage === img
                        ? "border-black"
                        : "border-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-gray-900 mb-4">
            ${product.price}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Product Features */}
          {Array.isArray(product.features) && product.features.length > 0 && (
            <ul className="list-disc pl-5 text-gray-700 mb-6">
              {product.features.map((feature, index) => (
                <li key={index} className="mb-2">
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Size:</h3>
              <RadioGroup
                value={selectedSize || ""}
                onValueChange={setSelectedSize}
              >
                <div className="flex space-x-2">
                  {product.sizes.map((size) => (
                    <div key={size}>
                      <RadioGroupItem
                        value={size}
                        id={`size-${size}`}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={`size-${size}`}
                        className={`px-3 py-1 border rounded cursor-pointer ${
                          selectedSize === size
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`}
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
              <Textarea
                placeholder="Enter custom text here"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full mb-2"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full"
              />
            </div>
          )}

          {uploadedImage && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Uploaded Image:</h3>
              <Image
                src={uploadedImage}
                alt="Uploaded custom image"
                width={50}
                height={50}
                className="rounded-lg"
              />
            </div>
          )}
          {/* Buttons */}
          <div className="flex space-x-4 mt-6">
            <Button size="lg" onClick={handleAddToCart} disabled={isAdding}>
              {isAdding ? "Adding..." : "Add to Cart"}
            </Button>
            <Button size="lg" variant="outline">
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="container mx-auto mt-20">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Customer Reviews
        </h2>
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
          <p className="text-lg font-semibold text-gray-700">
            &quot;Amazing quality! The fit is perfect and the fabric feels
            great.&quot;
          </p>
          <p className="text-gray-600 mt-2">- John Doe</p>
        </div>
      </div>

      {/* Related Products */}
      <div className="container mx-auto mt-20">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products
            .filter(item => item._id !== product._id)
            .slice(0, 4)
            .map(item => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition"
              >
                <div className="flex justify-center">
                  <Image
                    src={Array.isArray(item.images) && item.images.length > 0 
                      ? item.images[0] 
                      : "/placeholder.svg"}
                    alt={item.name}
                    width={250}
                    height={250}
                    className="w-full h-40 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-gray-700">${item.price.toFixed(2)}</p>
                  <Button className="bg-black text-white hover:bg-[rgb(20,184,166)] w-full mt-4">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}