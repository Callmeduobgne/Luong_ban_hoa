import { X } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/auth-context'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface MyOrdersPopupProps {
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
  items?: { name: string; quantity: number }[]
}

export function MyOrdersPopup({ isOpen, onClose }: MyOrdersPopupProps) {
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

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="p-6 pb-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Đơn hàng của tôi
            </h2>
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải đơn hàng...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Bạn chưa có đơn hàng nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg" style={{ fontFamily: 'Courier New, monospace' }}>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold text-gray-900 bg-gray-100">Mã đơn</th>
                    <th className="px-3 py-2 text-left font-bold text-gray-900 bg-gray-100">Ngày đặt</th>
                    <th className="px-3 py-2 text-left font-bold text-gray-900 bg-gray-100">Trạng thái</th>
                    <th className="px-3 py-2 text-left font-bold text-gray-900 bg-gray-100">Tổng tiền</th>
                    <th className="px-3 py-2 text-left font-bold text-gray-900 bg-gray-100">Phương thức</th>
                    <th className="px-3 py-2 text-left font-bold text-gray-900 bg-gray-100">Sản phẩm</th>
                    <th className="px-3 py-2 text-left font-bold text-gray-900 bg-gray-100">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="px-3 py-2 font-semibold text-gray-900">{order.order_number || order.id}</td>
                      <td className="px-3 py-2 text-gray-900 font-medium">{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                          order.status === 'completed' ? 'bg-green-600 text-white' :
                          order.status === 'pending' ? (order.payment_method === 'cod' ? 'bg-blue-600 text-white' : 'bg-yellow-500 text-white') :
                          order.status === 'processing' ? 'bg-blue-700 text-white' :
                          'bg-red-600 text-white'
                        }`}>
                          {order.status === 'completed' ? 'Hoàn thành' :
                           order.status === 'pending' ? (order.payment_method === 'cod' ? 'Đang giao hàng' : 'Chờ xử lý') :
                           order.status === 'processing' ? 'Đang xử lý' :
                           'Đã hủy'}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-bold text-right text-gray-900">{order.total_amount?.toLocaleString('vi-VN')}đ</td>
                      <td className="px-3 py-2 text-right text-gray-900 font-medium">{order.payment_method === 'bank' ? 'Chuyển khoản' : 'Tiền mặt'}</td>
                      <td className="px-3 py-2">
                        {order.items && order.items.length > 0 ? (
                          <ul>
                            {order.items.map((item, idx) => (
                              <li key={idx}>
                                <span className="font-semibold">{item.quantity}x</span> {item.name}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400 italic">Không có dữ liệu</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {order.status !== 'completed' && order.status !== 'cancelled' && (
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
                                if (res.ok) window.location.reload();
                              }
                            }}
                            className="px-3 py-1 border-2 border-red-600 text-red-600 rounded hover:bg-red-50 text-xs font-semibold"
                          >
                            Hủy đơn
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 