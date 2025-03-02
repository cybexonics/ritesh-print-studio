"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Table from "@/app/components/ui/table";
import Layout from "@/app/components/dashboardLayout";
import OrderDetails from "@/app/components/order-details";

interface Order {
  _id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  firstName:string;
  lastName:string;
}

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(
          "https://ritesh-print-studio-server.vercel.app/orders"
        );
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = (await res.json()) as Order[];
        setOrders(data);
      } catch (err) {
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
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
          <h1 className="text-2xl font-bold text-gray-800">All Orders</h1>
          <Link href="/admin/dashboard/add-order">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
              + Add Order
            </button>
          </Link>
        </div>
        <Table
          title="View"
          data={orders.map((order) => ({
            ...order,
            modalContent: <OrderDetails id={order._id} />,
          }))}
          columns={["_id","firstName","lastName", "totalAmount", "modalContent"]}
        />
      </div>
    </Layout>
  );
}
