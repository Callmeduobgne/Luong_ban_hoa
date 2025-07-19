'use client'

import { useState, useEffect } from 'react'
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

interface StatsData {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  revenueChange: number
  ordersChange: number
  usersChange: number
  productsChange: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    revenueChange: 0,
    ordersChange: 0,
    usersChange: 0,
    productsChange: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalProducts: 156,
        totalOrders: 324,
        totalUsers: 1234,
        totalRevenue: 45600000,
        revenueChange: 12.5,
        ordersChange: 8.2,
        usersChange: 15.3,
        productsChange: 5.1
      })
      setLoading(false)
    }, 1000)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const statCards = [
          {
      title: 'Tổng doanh thu',
      value: formatCurrency(stats.totalRevenue),
      change: stats.revenueChange,
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
          },
          {
      title: 'Đơn hàng',
      value: stats.totalOrders.toString(),
      change: stats.ordersChange,
            icon: ShoppingCart,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
      {
      title: 'Khách hàng',
      value: stats.totalUsers.toString(),
      change: stats.usersChange,
        icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
      },
      {
      title: 'Sản phẩm',
      value: stats.totalProducts.toString(),
      change: stats.productsChange,
      icon: Package,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-200 w-12 h-12"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card) => {
        const Icon = card.icon
        const isPositive = card.change >= 0
        
        return (
          <div key={card.title} className={`${card.bgColor} rounded-lg shadow p-6 border border-gray-100`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.color} text-white`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{card.change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
            </div>
          </div>
        )
      })}
    </div>
  )
} 