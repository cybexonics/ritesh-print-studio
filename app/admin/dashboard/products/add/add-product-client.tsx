"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import UnifiedProductForm from "@/app/components/product-form-unified"
import { useState, useEffect } from "react"

interface AddProductClientProps {
  category?: string
}

export function AddProductClient({ category }: AddProductClientProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show a consistent loading state during initial client-side render
  if (!mounted) {
    return (
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Products
        </Button>
      </div>

      <UnifiedProductForm
        defaultCategory={category}
        onSuccess={() => {
          // We don't navigate away since we want to allow editing the newly added product
        }}
      />
    </div>
  )
}

