import { Suspense } from "react"
import Layout from "@/app/components/dashboardLayout"
import ProtectedRoute from "@/app/admin/auth/ProtectedRoute"
import { CategoryProductsClient } from "./category-products-client"

// This is a server component
export default function CategoryProductsPage({ params }: { params: { category: string } }) {
  // Server components can directly use params
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
  )
}

