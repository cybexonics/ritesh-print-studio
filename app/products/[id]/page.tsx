"use client"
import Image from "next/image"
import { notFound, useParams } from "next/navigation"
import { Button } from "../../components/ui/button"
import { useState, useEffect, type ChangeEvent } from "react"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { useCart } from "@/app/components/CartContext"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { Label } from "@/app/components/ui/label"
import { Heart, ShoppingCart, Check, Upload } from "lucide-react"

interface Product {
  _id: string
  name: string
  price: number
  description: string
  features: string[]
  images: string[]
  category: string
  customizable: boolean
  sizes?: string[]
}

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const { addToCart } = useCart() // Using cart context
  const [isAdding, setIsAdding] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [customText, setCustomText] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      if (!id) return

      try {
        setLoading(true)
        const res = await fetch(`https://ritesh-print-studio-server.vercel.app/products/${id}`)
        if (!res.ok) throw new Error("Failed to fetch product")

        const data: Product = await res.json()
        setProduct(data)
        if (data.images.length > 0) setSelectedImage(data.images[0])
      } catch (err) {
        console.error("Fetch Error:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // Handle file upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Add to cart function
  const handleAddToCart = () => {
    if (!product) return
    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    setIsAdding(true)
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: selectedImage || product.images[0],
      color: null, // Add color property to match your CartContext
      size: selectedSize,
      customText,
      customImage: uploadedImage,
    })
    alert("Added to cart!")
    setTimeout(() => setIsAdding(false), 1000)
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <p className="text-center text-red-500 text-xl font-medium">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    )

  if (!product) return notFound()

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4 hover:text-gray-700 transition-colors">
          <button onClick={() => window.history.back()} className="flex items-center gap-1">
            ← Back to products
          </button>
        </div>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-6 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {/* Product Images */}
          <div className="p-4 md:p-5 flex flex-col">
            <div className="relative h-[350px] md:h-[450px] w-full bg-gray-50 rounded-xl overflow-hidden mb-3">
              {selectedImage && (
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain transition-all duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-8 mt-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
                      selectedImage === img
                        ? "ring-2 ring-offset-1 ring-black scale-105"
                        : "border border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} - View ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 20vw, 80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 md:p-5 flex flex-col">
            <div className="flex flex-col flex-grow">
              <div className="mb-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {product.category}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  ₹{typeof product.price === "number" ? product.price.toFixed(2) : Number(product.price).toFixed(2)}
                </p>

                <div className="prose prose-gray max-w-none mb-6">
                  <p className="text-gray-600">{product.description}</p>

                  {product.features.length > 0 && (
                    <div className="mt-3">
                      <h3 className="text-lg font-semibold mb-1">Features:</h3>
                      <ul className="space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Select Size:</h3>
                  <RadioGroup value={selectedSize || ""} onValueChange={setSelectedSize}>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <div key={size}>
                          <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                          <Label
                            htmlFor={`size-${size}`}
                            className={`px-4 py-2 border-2 rounded-lg cursor-pointer font-medium transition-all duration-200 hover:border-gray-400 ${
                              selectedSize === size
                                ? "bg-black text-white border-black"
                                : "bg-white text-gray-700 border-gray-200"
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

              {/* Customization */}
              {product.customizable && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Customization:</h3>
                  <Textarea
                    placeholder="Enter your custom text here..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="mb-3 resize-none border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                    rows={3}
                  />

                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="custom-image"
                    />
                    <Label
                      htmlFor="custom-image"
                      className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-700">Upload custom image</span>
                    </Label>
                  </div>

                  {uploadedImage && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium mb-2">Uploaded Image:</h4>
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        <Image
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Uploaded custom image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-3">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 bg-black hover:bg-gray-800 text-white py-5 rounded-xl font-medium transition-all duration-200"
                >
                  {isAdding ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Adding...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </span>
                  )}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-800 py-5 rounded-xl font-medium transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Add to Wishlist
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

