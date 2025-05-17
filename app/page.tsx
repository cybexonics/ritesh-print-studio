"use client"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Facebook, Instagram, Twitter, Star, Clock, Tag, Truck } from "lucide-react"
import Footer from "./components/Footer"
import { Button } from "./components/ui/button"
import { useState, useEffect } from "react"

// New Arrivals Data
const newArrivals = [
  {
    id: 1,
    name: "Custmized T shirt",
    price: 299,
    image: "https://res.cloudinary.com/dxd3jzvmq/image/upload/v1742129164/xobbtepowcffsyvtm7pu.jpg?height=400&width=300",
    tag: "New",
    path:"/category/t-shirts",
  },
  {
    id: 2,
    name: "Custmized Cup",
    price: 299,
    image: "https://res.cloudinary.com/dxd3jzvmq/image/upload/v1742135074/kciioafuruhryp3q4vds.jpg?height=400&width=300",
    tag: "Trending",
    path:"/category/mugs",
  },
  {
    id: 3,
    name: "Custmized Pillow",
    price: 449,
    image: "https://res.cloudinary.com/dxd3jzvmq/image/upload/v1742135073/rqhzltmlcwl9r1m8e7rx.webp?height=400&width=300",
    tag: "Best Seller",
    path:"/category/pillows",
  },
  {
    id: 4,
    name: "Custmized Bottles ",
    price: 299,
    image: "https://res.cloudinary.com/dxd3jzvmq/image/upload/v1742135073/ru8elvsgwyvzckblahlf.webp?height=400&width=300",
    tag: "New",
    path:"/category/water-bottles",
  },
]

// Reviews Data
const reviews = [
  {
    id: 1,
    name: "Dinesh Shinde(Shinde Classes)",
    rating: 5,
    comment: "Exceptional quality and style. The fit is perfect!",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Aayush Panchal",
    rating: 4,
    comment: "Great collection and amazing customer service.",
    
  },
  {
    id: 3,
    name: "Vishvjit.",
    rating: 4,
    comment: "The clothes are fantastic.",
    
  },
]

// Default categories to use as fallback
const defaultCategories = [
  { name: "T-shirts", image: "/t-shirt.jpg?height=600&width=400", count: "124 Items", slug: "t-shirts" },
  { name: "Hoodies", image: "/hoodies.jpg?height=600&width=400", count: "98 Items", slug: "hoodies" },
  { name: "Mousepads", image: "/mousepad.jpg?height=600&width=400", count: "56 Items", slug: "mousepads" },
  { name: "Mugs", image: "/cup.jpg?height=600&width=400", count: "78 Items", slug: "mugs" },
  { name: "Water Bottles", image: "/waterbottel.jpg?height=600&width=400", count: "45 Items", slug: "water-bottles" },
  { name: "Pillows", image: "/pillo.jpg?height=600&width=400", count: "67 Items", slug: "pillows" },
]

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

interface Category {
  name: string
  image: string
  count: string
  slug: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://ritesh-print-studio-server.vercel.app/products")
        if (!response.ok) throw new Error("Failed to fetch products")

        const data: Product[] = await response.json()
        setProducts(data)
      } catch (err) {
        setError("Error fetching products.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Add this useEffect after the existing useEffect for products
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("https://ritesh-print-studio-server.vercel.app/categories")

        if (!response.ok) {
          // If the endpoint doesn't exist yet, use hardcoded categories
          console.log("Categories endpoint not available, using fallback data")
          return // We already set default categories in the state initialization
        }

        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.log("Using fallback categories due to error:", err)
        // We already set default categories in the state initialization
      }
    }

    fetchCategories()
  }, [])

  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-24 min-h-[calc(100vh-5rem)] flex flex-col justify-center">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-10 text-center md:text-left">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-300">
                ALL ITEMS SALE
              </h2>
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    EXPLOSIVE
                  </span>
                  <span className="block text-4xl md:text-5xl lg:text-6xl font-script text-blue-600 mt-2">
                    Big Sale
                  </span>
                </h1>
                <Link
                  href="/products"
                  className="inline-block bg-gradient-to-r from-blue-800 to-blue-500 text-white px-6 md:px-8 py-3 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  BUY NOW
                </Link>
              </div>
            </div>

            {/* Newsletter */}
            <div className="max-w-lg mx-auto md:mx-0">
              <h3 className="text-lg font-semibold mb-4">Subscribe To Our Newsletter</h3>
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <input
                  type="email"
                  placeholder="ENTER EMAIL ID"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <button className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-600 transition-colors">
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center md:justify-start gap-4">
              <a href="#" className="text-gray-600 hover:text-teal-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-teal-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-teal-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-72 md:w-96 lg:w-[500px] h-72 md:h-96 lg:h-[500px] bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute w-60 md:w-80 lg:w-[400px] h-60 md:h-80 lg:h-[400px] bg-blue-400 rounded-full"></div>
            </div>
            <Image
              src="/home2.png?height=600&width=600"
              alt="Fashion Model"
              width={400}
              height={400}
              className="relative z-10 mx-auto w-60 md:w-80 lg:w-[400px] h-auto"
              priority
            />
            {/* Discount Badge */}
            <div className="absolute top-4 right-4 md:top-10 md:right-10 z-20 bg-white rounded-full w-20 h-20 md:w-28 md:h-28 flex flex-col items-center justify-center shadow-xl animate-float p-2 text-center">
              <div className="text-xs md:text-sm text-blue-600">14TH APR</div>
              <div className="text-lg md:text-2xl font-bold">Offer</div>
              <div className="text-sm md:text-lg font-black text-blue-600">Coming soon</div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container-margin">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Shop by Category
            <span className="block text-2xl text-gray-500 mt-2 font-normal">Find Your Perfect Style</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                href={`/category/${category.slug}`}
                key={index}
                className="group relative h-[600px] overflow-hidden rounded-2xl"
              >
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-gray-300">{category.count}</p>
                    <span className="inline-flex items-center mt-4 text-teal-400 group-hover:text-white transition-colors">
                      Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 bg-gradient-to-b from-gray-100 to-white">
     <div className="container-margin">
    <h2 className="text-4xl font-bold text-gray-900 text-center">
      New Arrivals
      <span className="block text-lg text-gray-600 mt-2 font-medium">
        Discover Our Latest Collection
      </span>
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-14">
      {newArrivals.map((item) => (
        <div
          key={item.id}
          className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
        >
          {/* Image Container with Full-Card Coverage */}
          <div className="relative w-full h-96">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              layout="fill" 
              className="w-full h-full object-cover rounded-t-2xl"
            />
            <span className="absolute top-3 left-3 bg-gradient-to-r from-[#34A9DC] to-[#2DD4BF] text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
              {item.tag}
            </span>
          </div>

          <div className="p-5 text-center">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#34A9DC] transition-colors">
              {item.name}
            </h3>
            <p className="text-base font-bold text-[#2DD4BF] mt-1">₹{item.price}</p>
            <div className="mt-4">
              <Link href={item.path}>
                <Button
                  variant="outline"
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#34A9DC] to-[#2DD4BF] text-white font-medium shadow-lg hover:shadow-cyan-400/50 transition-all hover:scale-105 duration-300"
                >
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>





      {/* Our Products Section */}
      <section className="py-20 bg-gradient-to-b from-gray-100 to-white">
  <div className="container-margin">
    <h2 className="text-4xl font-bold text-gray-900 text-center">
      Our Products
      <span className="block text-lg text-gray-600 mt-2 font-medium">
        Discover Our Latest Collection
      </span>
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-12">
      {products.map((product, index) => (
        <div
          key={index}
          className="group bg-white rounded-2xl shadow-md hover:shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-[#34A9DC]/50"
        >
          {/* Image container with a fixed height */}
          <div className="relative w-full h-72 flex justify-center items-center bg-gray-100">
            <Image
              src={product.images[0] || "/shirt.jpg"}
              alt={product.name}
              width={300}
              height={400}
              className="w-full h-full object-contain rounded-t-2xl"
            />
          </div>

          <div className="p-5 text-center">
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-[#34A9DC] transition-colors">
              {product.name}
            </h2>
            <p className="text-base font-bold text-[#2DD4BF] mt-1">
              ₹{typeof product.price === "number" ? product.price.toFixed(2) : Number(product.price).toFixed(2)}
            </p>
            <div className="mt-4">
              <Link href={`/products/${product._id}`}>
                <Button
                  variant="outline"
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#34A9DC] to-[#2DD4BF] text-white font-medium shadow-lg hover:shadow-cyan-400/50 transition-all hover:scale-105 duration-300"
                >
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Special Offers Section */}
      <section className="py-10 md:py-16 lg:py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-28 items-center">
          {/* Content Section */}
          <div className="max-w-3xl w-full">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 lg:mb-8 leading-tight">
              Holi Special Offer! Custom T-Shirts
              <span className="block text-blue-400 mt-2 md:mt-3 text-3xl md:text-4xl lg:text-5xl">
                at Just ₹199! 🎨✨
              </span>
            </h2>
            <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-8 lg:mb-10 leading-relaxed">
              Celebrate the festival of colors with your unique style! Get customized T-shirts and add a personal touch
              to your Holi celebrations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8 lg:mb-10">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-400 flex items-center justify-center text-xs md:text-sm font-bold">
                  ✓
                </div>
                <span className="text-gray-300 text-base md:text-lg">Premium Quality Fabric</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-400 flex items-center justify-center text-xs md:text-sm font-bold">
                  ✓
                </div>
                <span className="text-gray-300 text-base md:text-lg">Vibrant & Long-Lasting Prints</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-400 flex items-center justify-center text-xs md:text-sm font-bold">
                  ✓
                </div>
                <span className="text-gray-300 text-base md:text-lg">Your Own Custom Design</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-400 flex items-center justify-center text-xs md:text-sm font-bold">
                  ✓
                </div>
                <span className="text-gray-300 text-base md:text-lg">Perfect for Group & Family Parties</span>
              </div>
            </div>

            <a
              href="/shop"
              className="inline-block bg-blue-400 text-white px-8 py-3 md:px-12 md:py-4 text-base md:text-lg rounded-full hover:bg-blue-500 transition-colors"
            >
              Shop Now
            </a>
          </div>

          {/* Image Section */}
          <div className="flex justify-center md:justify-end mt-8 md:mt-0">
            <div className="relative w-full max-w-[350px] md:max-w-[450px] lg:max-w-[550px] aspect-square rounded-xl overflow-hidden bg-gray-700">
              <img
                src="https://res.cloudinary.com/dxd3jzvmq/image/upload/v1742136026/pwixgdkloeeiupspg63j.jpg"
                alt="Custom Holi T-Shirt"
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-blue-400 text-white text-base md:text-lg font-bold px-3 py-1 md:px-4 md:py-2 rounded-full">
                ₹199 Only!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-margin">
          <h2 className="text-4xl font-bold mb-12 text-center">
            What Our Customers Say
            <span className="block text-2xl text-gray-500 mt-2 font-normal">Real Reviews from Real Customers</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-6">
                  <Image
                    src={review.image || "/placeholder.svg"}
                    alt={review.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold">{review.name}</h3>
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-12 border-t">
        <div className="container-margin">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center">
              <Truck className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-gray-500">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Tag className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <h3 className="font-semibold">Special Discounts</h3>
                <p className="text-sm text-gray-500">Save up to 70% off</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Clock className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-sm text-gray-500">Get help anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </main>
  )
}

