'use client'

import { useState, useEffect } from 'react'
import { Package, DollarSign, Clock, Eye, Edit, RefreshCw, X } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone?: string
  total_amount: number
  status: string
  created_at: string
  user_full_name?: string
  user_phone?: string
  user_email?: string
  payment_method?: string
}

interface OrdersListProps {
  status: string
  searchQuery: string
}

function OrderDetailsDialog({ order, onClose }: { order: Order | null, onClose: () => void }) {
  if (!order) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Mã đơn hàng</p>
                <p className="font-semibold">{order.order_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày đặt</p>
                <p className="font-semibold">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Khách hàng</p>
                <p className="font-semibold">{order.user_full_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-semibold">{order.user_phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{order.user_email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                <p className="font-semibold">
                  {order.payment_method === 'bank' ? 'Chuyển khoản' : 'Tiền mặt'}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-2">Trạng thái đơn hàng</p>
              <span className={`inline-flex items-center justify-center px-3 py-1.5 min-w-[110px] text-xs font-semibold rounded-full shadow-sm border transition-colors duration-150 whitespace-nowrap text-center
                ${order.status === 'completed' ? 'bg-green-600 text-white border-green-700' :
                  order.status === 'pending' ? (order.payment_method === 'cod' ? 'bg-blue-600 text-white border-blue-700' : 'bg-yellow-500 text-white border-yellow-600') :
                  order.status === 'processing' ? 'bg-blue-600 text-white border-blue-700' :
                  'bg-red-600 text-white border-red-700'}
              `}>
                {order.status === 'completed' ? 'Hoàn thành' :
                  order.status === 'pending' ? (order.payment_method === 'cod' ? 'Đang giao hàng' : 'Chờ xử lý') :
                  order.status === 'processing' ? 'Đang xử lý' :
                  'Đã hủy'}
              </span>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-2">Tổng tiền</p>
              <p className="text-2xl font-bold text-gray-900">{order.total_amount.toLocaleString()} VND</p>
            </div>

            {order.status !== 'cancelled' && order.status !== 'completed' && (
              <div className="border-t pt-4 flex justify-end">
                <button
                  onClick={async () => {
                    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
                      const token = localStorage.getItem('access_token');
                      const res = await fetch(`http://localhost:5003/api/admin/orders/${order.id}/status`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ status: 'cancelled' })
                      });
                      if (res.ok) {
                        onClose();
                        window.location.reload();
                      }
                    }
                  }}
                  className="px-4 py-2 text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  Hủy đơn hàng
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function OrdersList({ status, searchQuery }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [status, searchQuery])

  const fetchOrders = async () => {
    setLoading(true)
    const token = localStorage.getItem('access_token')
    try {
      const response = await fetch('http://localhost:5003/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const result = await response.json()
        let filteredOrders = result.data.orders

        // Filter by status if not 'all'
        if (status !== 'all') {
          filteredOrders = filteredOrders.filter((order: Order) => order.status === status)
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filteredOrders = filteredOrders.filter((order: Order) => 
            order.order_number.toLowerCase().includes(query) ||
            order.customer_name.toLowerCase().includes(query)
          )
        }

        setOrders(filteredOrders)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-bold mb-4 text-black">Danh sách đơn hàng</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto" style={{ fontFamily: 'Courier New, monospace' }}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-black">Mã đơn</th>
                <th className="px-4 py-2 text-left text-black">Tên tài khoản</th>
                <th className="px-4 py-2 text-left text-black">SĐT đăng ký</th>
                <th className="px-4 py-2 text-left text-black">Email đăng ký</th>
                <th className="px-4 py-2 text-left text-black">Tổng tiền</th>
                <th className="px-4 py-2 text-left text-black">Phương thức</th>
                <th className="px-4 py-2 text-left text-black">Trạng thái</th>
                <th className="px-4 py-2 text-left text-black">Ngày tạo</th>
                <th className="px-4 py-2 text-left text-black">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr 
                  key={order.id} 
                  className="border-b hover:bg-gray-50 cursor-pointer" 
                  onClick={() => handleOrderClick(order)}
                >
                  <td className="px-4 py-2 text-black font-semibold">{order.order_number}</td>
                  <td className="px-4 py-2 text-black">{order.user_full_name || '-'}</td>
                  <td className="px-4 py-2 text-black">{order.user_phone || '-'}</td>
                  <td className="px-4 py-2 text-black">{order.user_email || '-'}</td>
                  <td className="px-4 py-2 text-black font-bold">{order.total_amount.toLocaleString()} VND</td>
                  <td className="px-4 py-2 text-black font-medium">
                    {order.payment_method === 'bank' ? 'Chuyển khoản' : 'Tiền mặt'}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1.5 min-w-[110px] text-xs font-semibold rounded-full shadow-sm border transition-colors duration-150 whitespace-nowrap text-center
                        ${order.status === 'completed' ? 'bg-green-600 text-white border-green-700' :
                          order.status === 'pending' ? (order.payment_method === 'cod' ? 'bg-blue-600 text-white border-blue-700' : 'bg-yellow-500 text-white border-yellow-600') :
                          order.status === 'processing' ? 'bg-blue-600 text-white border-blue-700' :
                          'bg-red-600 text-white border-red-700'}
                      `}>
                        {order.status === 'completed' ? 'Hoàn thành' :
                          order.status === 'pending' ? (order.payment_method === 'cod' ? 'Đang giao hàng' : 'Chờ xử lý') :
                          order.status === 'processing' ? 'Đang xử lý' :
                          'Đã hủy'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-black">{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 text-black hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOrderClick(order)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-black hover:text-orange-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      {order.payment_method === 'bank' && order.status === 'pending' && (
                        <button
                          className="p-1 text-white bg-green-600 rounded hover:bg-green-700 text-xs font-bold"
                          onClick={async () => {
                            const token = localStorage.getItem('access_token');
                            const res = await fetch(`http://localhost:5003/api/admin/orders/${order.id}/status`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify({ status: 'completed' })
                            });
                            if (res.ok) fetchOrders();
                          }}
                        >
                          Xác nhận
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsDialog 
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}
