"use client"

import Layout from "@/app/components/dashboardLayout"
import { CategoryList } from "@/app/components/category-management"
import ProtectedRoute from "@/app/admin/auth/ProtectedRoute"

export default function CategoriesPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Category Management</h1>
          <CategoryList />
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

