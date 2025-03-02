"use client"
import Layout from "@/app/components/dashboardLayout";
import { ProductUpdate } from "@/app/components/product-form";
import Table from "@/app/components/ui/table";
import { useState,useEffect } from "react";


interface Product {
  _id: number;
  name: string;
  price: number;
  description: string;
  features: string[];
  images: string[];
  category: string;
  customizable: boolean;
  sizes?: string[];
}


export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
  
    useEffect(() => {
      async function fetchProducts() {
        try {
          const response = await fetch(
            "https://ritesh-print-studio-server.vercel.app/products"
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
      return (
        <Layout>
          <p className="text-center mt-5">Loading products...</p>
        </Layout>
      );
    if (error)
      return (
        <Layout>
          <p className="text-center mt-5 text-red-500">{error} {JSON.stringify(products)}</p>
        </Layout>
      );
  return (
    <Layout>
      <div>
        <div className="bg-gray-100 mb-5">
          {/* Header */}
          <header className="bg-white p-4 shadow rounded-lg mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </header>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white shadow rounded-lg">
              <h2 className="text-lg font-semibold">Total Users</h2>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div className="p-6 bg-white shadow rounded-lg">
              <h2 className="text-lg font-semibold">Orders</h2>
              <p className="text-2xl font-bold">567</p>
            </div>
            <div className="p-6 bg-white shadow rounded-lg">
              <h2 className="text-lg font-semibold">Revenue</h2>
              <p className="text-2xl font-bold">$12,345</p>
            </div>
          </div>
        </div>
        <Table
          data={products.map((product) => ({
            ...product,
            modalContent: <ProductUpdate id={`${product._id}`} />,
          }))}
          columns={["name", "category", "price", "modalContent"]}
          title={"View"}
        />
      </div>
    </Layout>
  );
}
