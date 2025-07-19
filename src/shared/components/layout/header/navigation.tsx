'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

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
      { title: 'Hoa lan', href: '/products/fresh-flowers/orchids' },
    ],
  },
  {
    title: 'Hoa chúc mừng',
    href: '/products/congratulatory',
    items: [
      { title: 'Hoa sinh nhật', href: '/products/congratulatory/birthday' },
      { title: 'Hoa kỷ niệm', href: '/products/congratulatory/anniversary' },
      { title: 'Hoa khai trương', href: '/products/congratulatory/grand-opening' },
      { title: 'Hoa tốt nghiệp', href: '/products/congratulatory/graduation' },
    ],
  },
  {
    title: 'Quà tặng',
    href: '/products/gifts',
    items: [
      { title: 'Hộp quà hoa', href: '/products/gifts/flower-boxes' },
      { title: 'Giỏ quà', href: '/products/gifts/baskets' },
      { title: 'Combo hoa + quà', href: '/products/gifts/combos' },
    ],
  },
  {
    title: 'Dịch vụ',
    href: '/services',
    items: [
      { title: 'Giao hoa cùng ngày', href: '/services/same-day' },
      { title: 'Giao hàng toàn quốc', href: '/services/nationwide' },
      { title: 'Tùy chỉnh theo yêu cầu', href: '/services/custom' },
    ],
  },
]

export function Navigation() {
  return (
    <nav className="flex items-center space-x-8">
      {navigationItems.map((item) => (
        <div key={item.title} className="relative group">
          <Link
            href={item.href}
            className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors py-2"
          >
            <span className="font-medium">{item.title}</span>
            {item.items && <ChevronDown className="h-4 w-4" />}
          </Link>

          {/* Dropdown Menu */}
          {item.items && (
            <div className="absolute top-full left-0 w-56 bg-white shadow-lg rounded-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.title}
                    href={subItem.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  )
} 