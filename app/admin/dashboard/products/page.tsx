"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Table from "@/app/components/ui/table";
import Layout from "@/app/components/dashboardLayout";
import { ProductAdd, ProductUpdate } from "@/app/components/product-form";
import Modal from "@/app/components/ui/modal";

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
        const res = await fetch(
          "https://ritesh-print-studio-server.vercel.app/products"
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = (await res.json()) as Product[]; // ✅ Cast response
        setProducts(data);
      } catch (err) {
        setError("Error found");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading)
    return (
      <Layout>
        <p className="text-center mt-5">Loading products...</p>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <p className="text-center mt-5 text-red-500">{error}</p>
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
