import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Header } from '@/shared/components/layout/header/header'
import Footer from '@/shared/components/layout/footer/footer'
import { AuthProvider } from '@/features/auth/hooks/auth-context'
import { AuthPopup } from '@/features/auth/components/auth-popup'
import { Toaster } from 'react-hot-toast'
import '../assets/styles/product-card-effect.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: 'NO7.floral - Shop Hoa Tươi Thái Nguyên',
  description: 'NO7.floral chuyên cung cấp hoa tươi, hoa sinh nhật, hoa cưới, hoa tang lễ và quà tặng tại Thái Nguyên. Giao hoa miễn phí cùng ngày.',
  keywords: 'hoa tươi, shop hoa, hoa sinh nhật, hoa cưới, Thái Nguyên, giao hoa',
  authors: [{ name: 'NO7.floral' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
          <Header />
            <main className="flex-1">
            {children}
          </main>
          <Footer />
          </div>
          <AuthPopup />
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}