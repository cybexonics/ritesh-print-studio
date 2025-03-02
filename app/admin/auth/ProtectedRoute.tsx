"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    setIsAuthenticated(token); // Convert to boolean

    if (!token) {
      router.push("/admin/auth/login");
    }
  }, [router]);

  if (isAuthenticated === null) return null; // Prevents flickering while checking auth

  return <>{children}</>;
}
