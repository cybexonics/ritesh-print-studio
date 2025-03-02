'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag, ShoppingCart, Menu, X } from 'lucide-react'

export default function Header() {
  const cartCount = 0 // Replace with actual cart count logic
  const [isMenuOpen,setIsMenuOpen] = useState(false)
  return (
    <header className="fixed w-full top-0 z-30 bg-white/80 backdrop-blur-md">
      <div className="container-margin">
        <div className="flex items-center justify-between h-16 ">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-teal-400 rounded-full p-2">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              RITESH PRINT STUDIO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-teal-500 transition-colors">HOME</Link>
            
            {/* Dropdown - Desktop */}
            {/* <div className="relative group">
  <button className="text-gray-700 hover:text-teal-500 transition-colors">
    PRODUCTS
  </button>
  
  {/* Dropdown Menu *
  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible group-hover:opacity-100">
    <Link href="/category/t-shirt" className="block px-4 py-2 text-gray-700 hover:bg-teal-500 hover:text-white">T Shirt</Link>
    <Link href="/category/pillow" className="block px-4 py-2 text-gray-700 hover:bg-teal-500 hover:text-white">Pillow</Link>
    <Link href="/category/cups" className="block px-4 py-2 text-gray-700 hover:bg-teal-500 hover:text-white">Cups</Link>
    <Link href="/category/mouse-pad" className="block px-4 py-2 text-gray-700 hover:bg-teal-500 hover:text-white">Mouse Pad</Link>
    <Link href="/category/other" className="block px-4 py-2 text-gray-700 hover:bg-teal-500 hover:text-white">Other</Link>
  </div>
</div> */}

<Link href="/products" className="text-gray-700 hover:text-teal-500 transition-colors">PRODUCTS</Link>
            <Link href="/about" className="text-gray-700 hover:text-teal-500 transition-colors">ABOUT</Link>
            <Link href="/contact" className="text-gray-700 hover:text-teal-500 transition-colors">CONTACT</Link>

            {/* Cart Icon with Count */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-teal-500 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link href="/" className="text-gray-700 hover:text-teal-500 transition-colors">HOME</Link>

            {/* Dropdown - Mobile */}
            {/* <div className="relative group">
              <button className="text-gray-700 hover:text-teal-500 transition-colors">
                PRODUCTS
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
                <Link href="/category/t-shirt" className="block px-4 py-2 text-gray-700 hover:bg-teal-500 hover:text-white">T Shirt</Link>
                <Link href="/category/pillow" className="block px-4 py-2 text-gray-700 hover:bg-teal-500 hover:text-white">Pillow</Link>
                <Link href="/category/cups" className="block px-4 py-2 text-gray-700 hover:bg-teal-500 hover:text-white">Cups</Link>
                <Link href="/category/mouse-pad" className="block px-4 py-2 text-gray-700 hover:bg-teal-500 hover:text-white">Mouse Pad</Link>
                <Link href="/category/other" className="block px-4 py-2 text-gray-700 hover:bg-teal-500 hover:text-white">Other</Link>
              </div>
            </div> */}
            <Link href="/products" className="text-gray-700 hover:text-teal-500 transition-colors">PRODUCTS</Link>
            <Link href="/about" className="text-gray-700 hover:text-teal-500 transition-colors">ABOUT</Link>
            <Link href="/contact" className="text-gray-700 hover:text-teal-500 transition-colors">CONTACT</Link>
            <Link href="/cart" className="text-gray-700 hover:text-teal-500 transition-colors">CART ({cartCount})</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
