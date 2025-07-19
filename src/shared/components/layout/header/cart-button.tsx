'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, X, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import OrderInvoiceDialog from '@/components/ui/order-invoice-dialog'
import { useAuth } from '@/contexts/auth-context'

export function CartButton() {
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [openCheckout, setOpenCheckout] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const {
    items,
    removeItem,
    getTotalItems,
    getTotalAmount
  } = useCartStore()

  useEffect(() => { setIsMounted(true) }, [])
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!isMounted) return null;

  console.log('Giỏ hàng hiện tại:', items)
  console.log('Tổng tiền:', getTotalAmount())

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
      >
        <ShoppingCart className="h-6 w-6" />
        {getTotalItems() > 0 && (
          <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-orange-600 text-base text-white flex items-center justify-center font-bold shadow-lg border-2 border-white">
            {getTotalItems() > 99 ? '99+' : getTotalItems()}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Giỏ hàng của bạn</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
              </div>
            ) : (
              <>
                <div className="max-h-96 overflow-y-auto space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-20 w-20 flex-shrink-0">
                        <Image
                          src={item.product.image || '/images/placeholder.png'}
                          alt={item.product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 80vw"
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-primary-600">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-gray-900 text-lg">Tổng cộng:</span>
                    <span className="text-2xl font-extrabold text-orange-600 drop-shadow">
                      {formatPrice(getTotalAmount())}
                    </span>
                  </div>
                  <Link
                    href="/cart"
                    className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors mb-2"
                  >
                    Xem giỏ hàng
                  </Link>
                  <button
                    className="block w-full bg-[#ffbec8] hover:bg-[#ff8fa3] text-white text-center py-3 rounded-lg font-bold text-lg transition-colors"
                    onClick={() => setOpenCheckout(true)}
                  >
                    Thanh toán ngay
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <CheckoutDialog isOpen={openCheckout} onClose={() => setOpenCheckout(false)} total={getTotalAmount()} />
    </div>
  )
}

function CheckoutDialog({ isOpen, onClose, total }: { isOpen: boolean, onClose: () => void, total: number }) {
  const { items } = useCartStore()
  const { user, isLoggedIn } = useAuth()
  const [payment, setPayment] = useState('cod')
  const [phone, setPhone] = useState('')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [ward, setWard] = useState('')
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [showInvoice, setShowInvoice] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [editInfo, setEditInfo] = useState(false)

  // Khi mở dialog, nếu đã đăng nhập thì tự động điền tên và sdt
  useEffect(() => {
    if (isOpen && isLoggedIn && user) {
      setName(user.full_name || '')
      setPhone(user.phone || '')
    }
    if (isOpen && !isLoggedIn) {
      setName('')
      setPhone('')
    }
  }, [isOpen, isLoggedIn, user])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  // Thông tin chuyển khoản
  const bankNumber = "1453888888888"
  const bankCode = "TCB"
  const accountName = "DUONG DUC LUONG"
  const amount = total
  const addInfo = "THANH TOAN DON HANG"
  const qrUrl = `https://img.vietqr.io/image/${bankCode}-${bankNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(addInfo)}&accountName=${encodeURIComponent(accountName)}`

  const handleConfirmOrder = async () => {
    try {
      // Tạo đơn hàng mới
      const response = await fetch('http://localhost:5003/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          customer_name: name,
          total_amount: total,
          status: 'pending',
          customer_info: {
            name,
            phone,
            address,
            province,
            district,
            ward
          },
          payment_method: payment,
          items: items.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          }))
        })
      })

      if (response.ok) {
        const result = await response.json()
        setOrderNumber(result.order_number)
        setShowInvoice(true)
      } else {
        console.error('Failed to create order')
      }
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl text-base">
          <DialogHeader>
            <DialogTitle className="text-black font-bold text-2xl">Thanh toán đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="mb-4 flex flex-col gap-4">
            <div className="flex flex-row gap-6">
              {/* Vật phẩm bên trái */}
              <div className="w-1/2 min-w-0">
                <div className="font-bold text-black mb-2 text-xl">Sản phẩm đã chọn:</div>
                <div className="divide-y divide-gray-200">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center py-2 gap-2">
                      <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={item.product.image || '/images/placeholder.png'} alt={item.product.name} fill className="object-contain" sizes="56px" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-[#b8003c] truncate text-lg">{item.product.name}</div>
                        <div className="text-base text-gray-500">SL: {item.quantity}</div>
                        <div className="text-base text-gray-900 font-bold">{formatPrice(item.product.price * item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Địa chỉ bên phải */}
              <div className="w-1/2 min-w-0">
                <div className="font-bold text-black mb-2 text-xl">Địa chỉ nhận hàng:</div>
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      placeholder="Họ và tên" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ffbec8] h-[40px] text-black" 
                      disabled={isLoggedIn && !editInfo}
                    />
                    {isLoggedIn && (
                      <button
                        type="button"
                        className="text-xs text-[#b8003c] underline ml-2"
                        onClick={() => setEditInfo(e => !e)}
                      >
                        {editInfo ? 'Lưu' : 'Chỉnh sửa'}
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      placeholder="Số điện thoại" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      className="w-full border rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ffbec8] h-[40px] text-black" 
                      disabled={isLoggedIn && !editInfo}
                    />
                  </div>
                  <select 
                    value={province} 
                    onChange={e => setProvince(e.target.value)} 
                    className="w-full border rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ffbec8] h-[40px] appearance-none bg-white text-black"
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Thái Nguyên">Thái Nguyên</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                  </select>
                  <select 
                    value={district} 
                    onChange={e => setDistrict(e.target.value)} 
                    className="w-full border rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ffbec8] h-[40px] appearance-none bg-white text-black"
                  >
                    <option value="">Chọn quận/huyện</option>
                    <option value="Quận 1">Quận 1</option>
                    <option value="Quận 2">Quận 2</option>
                    <option value="TP Thái Nguyên">TP Thái Nguyên</option>
                    <option value="Sông Công">Sông Công</option>
                  </select>
                  <select 
                    value={ward} 
                    onChange={e => setWard(e.target.value)} 
                    className="w-full border rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ffbec8] h-[40px] appearance-none bg-white text-black"
                  >
                    <option value="">Chọn phường/xã</option>
                    <option value="Phường 1">Phường 1</option>
                    <option value="Phường 2">Phường 2</option>
                    <option value="Phường 3">Phường 3</option>
                    <option value="Phường 4">Phường 4</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Địa chỉ chi tiết" 
                    value={address} 
                    onChange={e => setAddress(e.target.value)} 
                    className="w-full border rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#ffbec8] h-[40px] text-black" 
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-4 items-start mt-2">
              {/* Chọn phương thức thanh toán góc dưới bên trái */}
              <div className="flex flex-col gap-2 w-1/3">
                <div className="font-bold text-black mb-1 text-lg">Thanh toán:</div>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1 cursor-pointer text-black font-bold text-base">
                    <input type="radio" name="payment" value="cod" checked={payment === 'cod'} onChange={() => setPayment('cod')} />
                    <span>Tiền mặt</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer text-black font-bold text-base">
                    <input type="radio" name="payment" value="bank" checked={payment === 'bank'} onChange={() => setPayment('bank')} />
                    <span>Chuyển khoản</span>
                  </label>
                </div>
              </div>
              {/* QR và xác nhận bên phải */}
              <div className="flex-1 flex flex-col items-center">
                {payment === 'bank' && (
                  <>
                    <div className="mb-2 text-center">
                      <span className="text-lg text-gray-700 font-semibold">
                        <span className="text-[#b8003c] font-bold">Techcombank</span> - <span className="font-bold">1453 8888 8888</span> - <span className="font-bold">Duong Duc Luong</span>
                      </span>
                    </div>
                    <div className="relative w-40 h-40 mb-1">
                      <Image
                        src="/images/thanhtoan/qr.png"
                        alt="QR Code chuyển khoản Techcombank"
                        fill
                        className="object-contain rounded-xl shadow"
                        sizes="160px"
                      />
                    </div>
                  </>
                )}
                <div className="font-bold text-xl text-[#b8003c] mt-1 mb-2">Số tiền: {formatPrice(total)}</div>
                <button 
                  className="w-full bg-[#ffbec8] hover:bg-[#ff8fa3] text-[#b8003c] font-bold px-6 py-3 rounded-lg transition-colors mt-1 text-lg" 
                  onClick={handleConfirmOrder}
                >
                  {payment === 'bank' ? 'Đã thanh toán xong' : 'Xác nhận đặt hàng'}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <OrderInvoiceDialog
        isOpen={showInvoice}
        onClose={() => {
          setShowInvoice(false)
          onClose()
        }}
        orderNumber={orderNumber}
        customerInfo={{
          name,
          phone,
          address,
          province,
          district,
          ward
        }}
        paymentMethod={payment}
        total={total}
      />
    </>
  )
} 