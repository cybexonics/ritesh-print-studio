"use client"
import './globals.css'
import Header from './components/Header'
import { CartProvider } from './components/CartContext'

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
      </body>
    </html>
  )
}

