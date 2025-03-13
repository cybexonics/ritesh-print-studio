"use client";

import { Suspense } from "react";
import Layout from "@/app/components/dashboardLayout";
import ProtectedRoute from "@/app/admin/auth/ProtectedRoute";
import { CategoryProductsClient } from "./category-products-client";
import { useParams } from "next/navigation"; // Import useParams for dynamic route handling

export default function CategoryProductsPage() {
  const params = useParams(); // Get params dynamically

  if (!params?.category || typeof params.category !== "string") {
    return (
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-red-600">Invalid Category</h1>
      </div>
    );
  }

  return (
    <Layout>
      <ProtectedRoute>
        <Suspense
          fallback={
            <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Loading Products...</h1>
            </div>
          }
        >
          <CategoryProductsClient category={params.category} />
        </Suspense>
      </ProtectedRoute>
    </Layout>
  );
}
