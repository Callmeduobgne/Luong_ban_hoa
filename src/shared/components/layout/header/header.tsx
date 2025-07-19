'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { UserMenu } from './user-menu'
import { CartButton } from './cart-button'
import { Menu, X } from 'lucide-react'
import { MobileNav } from './mobile-nav'

const navigationItems = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Bó hoa', href: '/products/bo-hoa' },
  { name: 'Hộp hoa', href: '/products/hop-hoa' },
  { name: 'Hoa trang trí', href: '/products/hoa-trang-tri' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-700 ease-out ${
      isScrolled 
        ? 'bg-gradient-to-r from-rose-50/95 via-pink-50/95 to-rose-50/95 backdrop-blur-lg shadow-2xl border-b border-rose-200/50' 
        : 'bg-white shadow-sm'
    }`} style={{ fontFamily: 'Courier New, monospace' }}>
      {/* Top Bar */}
      <div className={`border-b transition-all duration-700 ease-out ${
        isScrolled 
          ? 'border-rose-200/50 bg-gradient-to-r from-rose-100/90 via-pink-100/90 to-rose-100/90' 
          : 'border-gray-100 bg-primary-50'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className={`flex items-center space-x-4 transition-colors duration-500 ${
              isScrolled ? 'text-rose-700' : 'text-gray-600'
            }`}>
              <span>📞 Hotline: 0987.654.321</span>
              <span className="hidden md:inline">📍 Thái Nguyên</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`hidden sm:flex items-center space-x-4 transition-colors duration-500 ${
                isScrolled ? 'text-rose-700' : 'text-gray-600'
              }`}>
                <span>🚚 Miễn phí giao hàng từ 500k</span>
                <span>⏰ 8:00 - 22:00</span>
              </div>
              {/* User Menu & Cart in Top Bar */}
              <div className="flex items-center gap-3">
                <UserMenu />
                <CartButton />
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Logo Section - Centered */}
        <div className="flex items-center justify-center py-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12 lg:w-16 lg:h-16">
              <Image
                src="/images/logo.png"
                alt="no.07 floral Logo"
                fill
                sizes="(max-width: 1024px) 48px, 64px"
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center">
              <h1 className={`text-2xl lg:text-3xl font-bold transition-all duration-500 ${
                isScrolled 
                  ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 bg-clip-text text-transparent' 
                  : 'gradient-text'
              }`}>
                no.07 floral
              </h1>
              <p className={`text-sm gentle-wave transition-colors duration-500 ${
                isScrolled ? 'text-rose-600' : 'text-gray-600'
              }`}>
                🌸 Luong Ban Hoa - Thái Nguyên
              </p>
            </div>
          </Link>
          </div>

        {/* Navigation Section */}
        <div className="flex items-center justify-center h-16">
          {/* Center - Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors duration-300 hover:text-rose-600 relative group ${
                  isScrolled ? 'text-gray-800' : 'text-gray-700'
                }`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden absolute right-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors spring-bounce"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="lg:hidden pb-4">
          <nav className="flex flex-wrap items-center justify-center gap-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-medium text-gray-700 hover:text-rose-600 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-rose-50"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* Decorative bottom border with enhanced effect */}
      <div className={`h-1 bg-gradient-to-r from-rose-400 via-pink-500 to-rose-600 transition-all duration-700 ease-out ${
        isScrolled ? 'opacity-100 shadow-lg shadow-rose-200' : 'opacity-0'
      }`}></div>
      
      {/* Additional subtle glow effect when scrolled */}
      {isScrolled && (
        <div className="absolute inset-0 bg-gradient-to-b from-rose-100/20 to-transparent pointer-events-none transition-opacity duration-700" />
      )}
    </header>
  )
} 