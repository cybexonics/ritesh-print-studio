import { Suspense } from "react"
import Layout from "@/app/components/dashboardLayout"
import ProtectedRoute from "@/app/admin/auth/ProtectedRoute"
import { EditProductClient } from "./edit-product-client"

// This is a server component
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params object before accessing its properties
  const { id } = await params

  return (
    <Layout>
      <ProtectedRoute>
        <Suspense
          fallback={
            <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Loading Product...</h1>
            </div>
          }
        >
          <EditProductClient id={id} />
        </Suspense>
      </ProtectedRoute>
    </Layout>
  )
}

