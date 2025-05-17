import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="container-margin py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Ritesh Print Studio</h3>
            <p className="text-gray-400 mb-4">Discover the latest trends in men&apos;s fashion. Quality clothing for every style and occasion.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/term-condition" className="text-gray-400 hover:text-white transition-colors">Term & Condition</Link></li>
              <li><Link href="/shipping-policy" className="text-gray-400 hover:text-white transition-colors">Shipping</Link></li>
              <li><Link href="/cancelltion" className="text-gray-400 hover:text-white transition-colors">Cancellation</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="text-gray-400 mb-4">
              <b>Address</b>: Baramati, 413102, Dist: Pune, MH, India <br/>
              <b>Phone No:</b> <Link href="tel:+918380075733">+91 83800 75733</Link><br/>
              <b>Email</b>: <Link href="mail:riteshprintstudio@gmail.com">riteshprintstudio@gmail.com</Link>
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Fashion Store. All rights reserved.</p>
          <p> Design by Cybexsonic IT consltants PVT. Ltd</p>
        </div>
      </div>
    </footer>
  )
}

