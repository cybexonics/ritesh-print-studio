"use client"
import Image from "next/image"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { Button } from "../../components/ui/button"
import { products as product,categorys} from "@/app/lib/db"


export default function CategoryPage() {
  const {slug } = useParams()
  const products = product.filter(f=>f.category === slug)

  if (!products) {
    notFound()
  }

  const categoryName = categorys.find(f=>f.slug === slug)

  return (
    <div className="container mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-8">{categoryName?.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={400}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
              <div className="flex justify-between items-center">
                <Link href={`/products/${product.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
                <Button>Add to Cart</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

