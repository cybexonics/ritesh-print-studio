import { Suspense } from "react"
import Layout from "@/app/components/dashboardLayout"
import ProtectedRoute from "@/app/admin/auth/ProtectedRoute"
import { AddProductClient } from "./add-product-client"

// This is a server component
export default async function AddProductPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  // Await searchParams before accessing its properties
  const { category } = await searchParams

  return (
    <Layout>
      <ProtectedRoute>
        <Suspense
          fallback={
            <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Loading...</h1>
            </div>
          }
        >
          <AddProductClient category={category} />
        </Suspense>
      </ProtectedRoute>
    </Layout>
  )
}

