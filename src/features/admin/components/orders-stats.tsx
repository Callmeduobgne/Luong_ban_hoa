'use client'

import { useState, useEffect } from 'react'
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'

interface StatCard {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: React.ComponentType<any>
  color: string
}

export function OrdersStats() {
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: 'Tổng đơn hàng',
      value: '0',
      change: '+0%',
      changeType: 'increase',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Doanh thu',
      value: '0',
      change: '+0%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Đơn hôm nay',
      value: '0',
      change: '+0%',
      changeType: 'increase',
      icon: ShoppingCart,
      color: 'yellow'
    },
    {
      title: 'Đơn pending',
      value: '0',
      change: '+0%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'purple'
    }
  ])

  const [loading, setLoading] = useState(true)

  // Fetch dashboard stats from backend
  useEffect(() => {
    fetchOrdersStats()
  }, [])

  const fetchOrdersStats = async () => {
    try {
      setLoading(true)
      
      // Lấy token từ localStorage
      const token = localStorage.getItem('access_token')
      if (!token) {
        console.error('No token found')
        setMockData()
        return
      }
      
      // Gọi API dashboard-stats backend
      const response = await fetch('http://localhost:5003/api/admin/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const data = result.data
          setStats([
            {
              title: 'Tổng đơn hàng',
              value: data.total_users?.toString() || '0',
              change: '+25%',
              changeType: 'increase',
              icon: Package,
              color: 'blue'
            },
            {
              title: 'Doanh thu đã xác nhận',
              value: `${(data.revenue || 0).toLocaleString()} VND`,
              change: '+12%',
              changeType: 'increase',
              icon: DollarSign,
              color: 'green'
            },
            {
              title: 'Doanh thu chờ xác nhận',
              value: `${(data.pending_revenue || 0).toLocaleString()} VND`,
              change: '+0%',
              changeType: 'increase',
              icon: DollarSign,
              color: 'yellow'
            },
            {
              title: 'Đơn hôm nay',
              value: data.today_registrations?.toString() || '0',
              change: '+100%',
              changeType: 'increase',
              icon: ShoppingCart,
              color: 'purple'
            },
            {
              title: 'Đơn pending',
              value: data.active_users?.toString() || '0',
              change: '0%',
              changeType: 'increase',
              icon: TrendingUp,
              color: 'purple'
            }
          ])
        }
      } else {
        console.error('Failed to fetch dashboard stats:', response.status)
        setMockData()
      }
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setMockData()
    } finally {
      setLoading(false)
    }
  }

  const setMockData = () => {
    // Mock data for orders
    setStats([
      {
        title: 'Tổng đơn hàng',
        value: '1',
        change: '+25%',
        changeType: 'increase',
        icon: Package,
        color: 'blue'
      },
      {
        title: 'Doanh thu',
        value: '350,000 VND',
        change: '+12%',
        changeType: 'increase',
        icon: DollarSign,
        color: 'green'
      },
      {
        title: 'Đơn hôm nay',
        value: '1',
        change: '+100%',
        changeType: 'increase',
        icon: ShoppingCart,
        color: 'yellow'
      },
      {
        title: 'Đơn pending',
        value: '1',
        change: '0%',
        changeType: 'increase',
        icon: TrendingUp,
        color: 'purple'
      }
    ])
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return { bg: 'bg-blue-100', text: 'text-blue-600' }
      case 'green':
        return { bg: 'bg-green-100', text: 'text-green-600' }
      case 'yellow':
        return { bg: 'bg-yellow-100', text: 'text-yellow-600' }
      case 'purple':
        return { bg: 'bg-purple-100', text: 'text-purple-600' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' }
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            </div>
            <div className="mt-4">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const colors = getColorClasses(stat.color)
        
        return (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colors.bg}`}>
                <Icon className={`w-6 h-6 ${colors.text}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">so với tháng trước</span>
            </div>
          </div>
        )
      })}
    </div>
  )
} 