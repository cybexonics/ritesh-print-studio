"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Dumbbell,
  Home,
  Dumbbell as DumbbellIcon,
  Calendar,
  Users,
  Award,
  Settings,
  Package,
  ShoppingCart,
} from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 mt-14 bg-gray-100">{children}</main>
    </div>
  );
}

const menuItems = [
  {
    icon: <Home className="w-6 h-6" />,
    text: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    icon: <Package className="w-6 h-6" />,
    text: "Products",
    href: "/admin/dashboard/products",
  },
  {
    icon: <ShoppingCart className="w-6 h-6" />,
    text: "Orders",
    href: "/admin/dashboard/order",
  },
  {
    icon: <Users className="w-6 h-6" />,
    text: "Other",
    href: "/community",
  },
  {
    icon: <Settings className="w-6 h-6" />,
    text: "Settings",
    href: "/settings",
  },
];

export function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className={`flex ${
        isSidebarOpen ? "block" : "hidden"
      } md:block inset-y-0 left-0 top-0 w-64 bg-gray-800 text-white py-7 px-4 space-y-6 z-10`}
    >
      {/* Sidebar Logo */}
      <Link
        href="/"
        className="flex items-center space-x-2 text-white text-xl font-extrabold"
      >
        <Dumbbell className="w-8 h-8" />
        <span>FitTrack Pro</span>
      </Link>
      {/* Sidebar Menu */}
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center py-2.5 px-4 rounded-md text-white hover:bg-gray-700 hover:text-white transition"
          >
            {item.icon}
            <span className="ml-2">{item.text}</span>
          </Link>
        ))}
      </nav>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden absolute top-4 left-4 text-white focus:outline-none"
      >
        <span className="text-xl">☰</span>
      </button>
    </div>
  );
}
