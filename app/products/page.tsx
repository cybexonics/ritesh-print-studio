"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("Fetching from:", "https://ritesh-print-studio-server.vercel.app/products");
        const response = await fetch("https://ritesh-print-studio-server.vercel.app/products");
        const data = await response.json();
        console.log("Success:", data);
        setProducts(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err instanceof Error ? `Error fetching products: ${err.message}` : "Unknown error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-20 text-lg">Loading products...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{`${error}`}</p>;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-10 md:px-16 lg:px-24">
        <h2 className="text-5xl font-extrabold mb-12 text-center text-gray-800">
          All Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 w-[90%] mx-auto"
            >
              <div className="relative w-full h-80 rounded-t-3xl flex items-center justify-center overflow-hidden">
                <Image
                  src={product.images[0] || "/shirt.jpg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm shadow-lg font-medium">
                  New
                </span>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{product.name}</h3>
                <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                <div className="mt-4">
                  <Link href={`/products/${product._id}`}>
                    <Button variant="outline" className="px-5 py-2 border-2 border-blue-500 text-blue-500 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 rounded-full shadow-md font-medium">
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
  );
}
