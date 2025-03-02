import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'

interface Product {
  id: number
  name: string
  price: number
  image: string
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={400}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
              <div className="flex justify-between items-center">
                <Link href={`/product/${product.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
                <Button>Add to Cart</Button>
              </div>
            </div>
          </div>

  )
}
