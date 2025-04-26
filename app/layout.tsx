"use client"
import './globals.css'
import Header from './components/Header'
import { CartProvider } from './components/CartContext'
import Script from "next/script";

// export const metadata = {
//   title: 'Fashion Store - Explosive Sale',
//   description: 'Discover the latest trends in fashion with amazing discounts',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body ssr-disable-hydration="true">
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      </body>
    </html>
  )
}

