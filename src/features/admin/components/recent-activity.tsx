'use client'

import { useState, useEffect } from 'react'
import { Clock, Package, ShoppingCart, User, AlertCircle } from 'lucide-react'

interface Activity {
  id: string
  type: 'order' | 'product' | 'user' | 'system'
  title: string
  description: string
  timestamp: string
  user?: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setActivities([
        {
          id: '1',
          type: 'order',
          title: 'Đơn hàng mới',
          description: 'Đơn hàng #12345 được tạo bởi Nguyễn Văn A',
          timestamp: '5 phút trước',
          user: 'Nguyễn Văn A'
        },
        {
          id: '2', 
          type: 'product',
          title: 'Sản phẩm được thêm',
          description: 'Bó hoa hồng đỏ được thêm vào cửa hàng',
          timestamp: '15 phút trước',
          user: 'Admin'
        },
        {
          id: '3',
          type: 'user',
          title: 'Khách hàng mới',
          description: 'Trần Thị B đã đăng ký tài khoản',
          timestamp: '30 phút trước',
          user: 'Trần Thị B'
        },
        {
          id: '4',
          type: 'order',
          title: 'Đơn hàng hoàn thành',
          description: 'Đơn hàng #12340 đã được giao thành công',
          timestamp: '1 giờ trước',
          user: 'Lê Văn C'
        },
        {
          id: '5',
          type: 'system',
          title: 'Hệ thống',
          description: 'Cập nhật danh sách sản phẩm thành công',
          timestamp: '2 giờ trước',
          user: 'System'
        }
      ])
      setLoading(false)
    }, 800)
  }, [])

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'order':
        return ShoppingCart
      case 'product':
        return Package
      case 'user':
        return User
      case 'system':
        return AlertCircle
      default:
        return Clock
    }
  }

  const getIconColor = (type: Activity['type']) => {
    switch (type) {
      case 'order':
        return 'bg-green-500'
      case 'product':
        return 'bg-blue-500'
      case 'user':
        return 'bg-purple-500'
      case 'system':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start space-x-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Xem tất cả
          </button>
      </div>

          <div className="space-y-4">
            {activities.map((activity) => {
          const Icon = getIcon(activity.type)
          const iconColor = getIconColor(activity.type)
          
              return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-full ${iconColor} text-white flex-shrink-0`}>
                <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                {activity.user && (
                  <p className="text-xs text-gray-500 mt-1">bởi {activity.user}</p>
                )}
              </div>
              <div className="flex-shrink-0">
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              )
            })}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Chưa có hoạt động nào</p>
        </div>
      )}
    </div>
  )
} 