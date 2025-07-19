'use client'

import Link from 'next/link'
import { Plus, Package, Users, ShoppingCart, BarChart3, Settings, FileText } from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      title: 'Thêm sản phẩm',
      description: 'Thêm sản phẩm mới vào cửa hàng',
      icon: Package,
      href: '/admin/products/new',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Quản lý blog',
      description: 'Viết và quản lý bài viết blog',
      icon: FileText,
      href: '/admin/blogs',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'Quản lý đơn hàng',
      description: 'Xem và xử lý đơn hàng',
      icon: ShoppingCart,
      href: '/admin/orders',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Quản lý khách hàng',
      description: 'Xem danh sách khách hàng',
      icon: Users,
      href: '/admin/users',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Báo cáo',
      description: 'Xem báo cáo doanh thu',
      icon: BarChart3,
      href: '/admin/reports',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.title}
              href={action.href}
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${action.color} text-white mr-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{action.title}</h4>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 