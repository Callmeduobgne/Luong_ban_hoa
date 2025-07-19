'use client'

import { X, User, Phone, Mail, ShoppingBag } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface AccountInfoPopupProps {
  isOpen: boolean
  onClose: () => void
}

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  created_at: string
  payment_method?: string
}

export function AccountInfoPopup({ isOpen, onClose }: AccountInfoPopupProps) {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && user) {
      const fetchOrders = async () => {
        try {
          const token = localStorage.getItem('access_token')
          const response = await axios.get('http://localhost:5003/api/admin/my-orders', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setOrders(response.data.data.orders)
        } catch (error) {
          console.error('Error fetching orders:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchOrders()
    }
  }, [isOpen, user])

  if (!isOpen || !user) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-2xl shadow-xl w-full max-w-md relative transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="p-6 pb-4">
            <div className="text-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 mx-auto mb-4">
                <span className="text-xl font-bold text-white">N7</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Thông tin tài khoản
              </h2>
            </div>

            {/* User Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Họ và tên</div>
                  <div className="font-medium text-gray-900">{user.full_name}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Số điện thoại</div>
                  <div className="font-medium text-gray-900">{user.phone}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium text-gray-900">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ShoppingBag className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Đơn hàng đã mua</div>
                  <div className="font-medium text-gray-900">
                    {loading ? 'Đang tải...' : `${orders.length} đơn hàng`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 