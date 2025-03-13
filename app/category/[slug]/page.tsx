import { Suspense } from "react"
import { CategoryClient } from "./category-client"

// This is a server component
export default function CategoryPage({ params }: { params: { slug: string } }) {
  // Server components can directly use params
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 mt-20">Loading...</div>}>
      <CategoryClient slug={params.slug} />
    </Suspense>
  )
}

