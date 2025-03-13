"use client";

import { Suspense } from "react";
import { CategoryClient } from "./category-client";
import { useParams } from "next/navigation"; // Import useParams for dynamic route handling

export default function CategoryPage() {
  const params = useParams(); // Get params dynamically

  if (!params?.slug || typeof params.slug !== "string") {
    return (
      <div className="container mx-auto px-4 py-8 mt-20 text-red-600">
        Invalid category
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 mt-20">Loading...</div>}>
      <CategoryClient slug={params.slug} />
    </Suspense>
  );
}
