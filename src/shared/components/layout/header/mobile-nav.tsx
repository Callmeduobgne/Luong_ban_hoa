'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, X, User, LogOut } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/auth-context'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

const navigationItems = [
  {
    title: 'Trang chủ',
    href: '/',
  },
  {
    title: 'Hoa tươi',
    href: '/products/fresh-flowers',
    items: [
      { title: 'Bó hoa', href: '/products/fresh-flowers/bouquets' },
      { title: 'Lẵng hoa', href: '/products/fresh-flowers/arrangements' },
      { title: 'Hoa hồng', href: '/products/fresh-flowers/roses' },
      { title: 'Hoa tulip', href: '/products/fresh-flowers/tulips' },
    ],
  },
  {
    title: 'Hoa chúc mừng',
    href: '/products/congratulatory',
    items: [
      { title: 'Hoa sinh nhật', href: '/products/congratulatory/birthday' },
      { title: 'Hoa kỷ niệm', href: '/products/congratulatory/anniversary' },
      { title: 'Hoa khai trương', href: '/products/congratulatory/grand-opening' },
    ],
  },
  {
    title: 'Quà tặng',
    href: '/products/gifts',
    items: [
      { title: 'Hộp quà hoa', href: '/products/gifts/flower-boxes' },
      { title: 'Giỏ quà', href: '/products/gifts/baskets' },
    ],
  },
]

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [isMounted, setIsMounted] = useState(false)
  const { user, isLoggedIn, logout, openAuthPopup } = useAuth()
  useEffect(() => { setIsMounted(true) }, [])
  if (!isMounted || !isOpen) return null;

  const toggleExpanded = (title: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(title)) {
      newExpanded.delete(title)
    } else {
      newExpanded.add(title)
    }
    setExpandedItems(newExpanded)
  }

  const handleAuthAction = (action: 'login' | 'register') => {
    onClose()
    openAuthPopup(action)
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Mobile Menu */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Section */}
        {isLoggedIn && (
          <div className="p-4 bg-primary-50 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {user?.full_name}
                </div>
                <div className="text-sm text-gray-600">
                  {user?.role === 'admin' ? '👑 Admin' : '👤 Khách hàng'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="overflow-y-auto h-full pb-20">
          <div className="p-4 space-y-1">
            {navigationItems.map((item) => (
              <div key={item.title}>
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex-1 py-3 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                  >
                    {item.title}
                  </Link>
                  {item.items && (
                    <button
                      onClick={() => toggleExpanded(item.title)}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {expandedItems.has(item.title) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Submenu */}
                {item.items && expandedItems.has(item.title) && (
                  <div className="ml-4 space-y-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        onClick={onClose}
                        className="block py-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* User Actions */}
          <div className="border-t border-gray-200 p-4 space-y-2">
            {isLoggedIn ? (
              <>
                <Link
                  href="/account"
                  onClick={onClose}
                  className="flex items-center space-x-2 w-full py-3 text-[#ffbec8] hover:text-[#ff8fa3] transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>Thông tin tài khoản</span>
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center space-x-2 w-full py-3 text-[#ffbec8] hover:text-[#ff8fa3] transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>👑 Quản trị hệ thống</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full py-3 text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleAuthAction('login')}
                  className="block w-full py-3 text-center text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => handleAuthAction('register')}
                  className="block w-full py-3 text-center text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
} 