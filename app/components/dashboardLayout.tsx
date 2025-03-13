import type React from "react"
import { Home, Package, ShoppingCart, Tag, Users, Settings } from "lucide-react"

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
    icon: <Tag className="w-6 h-6" />,
    text: "Categories",
    href: "/admin/dashboard/categories",
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
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
        </div>
        <nav>
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="p-4 hover:bg-gray-700">
                <a href={item.href} className="flex items-center">
                  {item.icon}
                  <span className="ml-2">{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 mt-5">{children}</div>
    </div>
  )
}

