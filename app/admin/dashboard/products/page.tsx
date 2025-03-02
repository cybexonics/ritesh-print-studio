"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Table from "@/app/components/ui/table";
import Layout from "@/app/components/dashboardLayout";
import { ProductAdd, ProductUpdate } from "@/app/components/product-form";
import Modal from "@/app/components/ui/modal";
import ProtectedRoute from "../../auth/ProtectedRoute";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
}

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]); // ✅ Define type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading)
    return (
      <Layout>
        <ProtectedRoute>
          <p className="text-center mt-20">Loading products...</p>
        </ProtectedRoute>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <ProtectedRoute>
          <p className="text-center mt-20 text-red-500">{error} {JSON.stringify(products)}</p>
        </ProtectedRoute>
      </Layout>
    );

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">All Products</h1>
          <Modal title="Add Product">
            <ProductAdd />
          </Modal>
        </div>
        <Table
          title="Update"
          data={products.map((product) => ({
            ...product,
            modalContent: <ProductUpdate id={product._id} />, // ✅ Type-safe
          }))}
          columns={["_id", "name", "category", "price", "modalContent"]}
        />
      </div>
    </Layout>
  );
}
