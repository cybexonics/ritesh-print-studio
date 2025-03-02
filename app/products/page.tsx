"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  features: string[];
  images: string[];
  category: string;
  customizable: boolean;
  sizes?: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "https://ritesh-print-studio.vercel.app/products"
        );
        if (!response.ok) throw new Error("Failed to fetch products");

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError("Error fetching products.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading)
    return <p className="text-center mt-5 text-lg">Loading products...</p>;
  if (error) return <p className="text-center mt-5 text-red-500">{error}</p>;
  return (
    <div className="bg-white min-h-screen py-12 px-6 md:px-16 lg:px-24">
      {/* Adjusted margin-top and increased spacing below the heading */}
      <div className="container mx-auto mt-20">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-20">
          All Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {products
            .sort((a, b) => b.category.localeCompare(a.category))
            .map((product,index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <Image
                  src={product.images[0] || "/shirt.jpg"}
                  alt={product.name}
                  width={300}
                  height={400}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-gray-600 mb-4">
                    ${product.price}
                  </p>
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
    </div>
  );
}
