import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import { useCartStore } from '@/store/cart-store'

interface OrderInvoiceDialogProps {
  isOpen: boolean
  onClose: () => void
  orderNumber: string
  customerInfo: {
    name: string
    phone: string
    address: string
    province: string
    district: string
    ward: string
  }
  paymentMethod: string
  total: number
}

export default function OrderInvoiceDialog({
  isOpen,
  onClose,
  orderNumber,
  customerInfo,
  paymentMethod,
  total
}: OrderInvoiceDialogProps) {
  const { items } = useCartStore()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-[#b8003c]">
            HÓA ĐƠN ĐẶT HÀNG
          </DialogTitle>
          <div className="flex flex-col items-center justify-center mt-2 gap-1">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <Image src="/images/logo.png" alt="NO.07 FLORAL" fill sizes="40px" className="object-contain" />
              </div>
              <span className="font-bold text-base" style={{ color: '#6B4F36' }}>NO.07 FLORAL</span>
            </div>
            <div className="text-xs text-gray-600 text-center mt-1">
              <div>Địa chỉ: 123 Đường ABC, Quận XYZ</div>
              <div>Hotline: 0123 456 789</div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header Info */}
          <div className="flex justify-end items-start border-b pb-3">
            <div className="bg-white rounded px-3 py-2 text-right">
              <p className="font-bold text-sm text-black">Mã đơn: {orderNumber}</p>
              <p className="text-sm text-black">{new Date().toLocaleDateString('vi-VN')}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="border-b pb-3 bg-white rounded border border-gray-200 shadow-sm">
            <h4 className="font-extrabold mb-2 text-sm text-[#b8003c]">Thông tin khách hàng:</h4>
            <div className="space-y-1 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-black">Họ tên:</p>
                  <p className="font-medium text-gray-900">{customerInfo.name}</p>
                </div>
                <div>
                  <p className="text-black">Số điện thoại:</p>
                  <p className="font-medium text-gray-900">{customerInfo.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-black">Địa chỉ:</p>
                <p className="font-medium text-gray-900">{customerInfo.address}</p>
              </div>
              <div>
                <p className="text-black">Khu vực:</p>
                <p className="font-medium text-gray-900">{customerInfo.ward}, {customerInfo.district}, {customerInfo.province}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-b pb-3">
            <h4 className="font-bold mb-2 text-sm">Chi tiết đơn hàng:</h4>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-[#b8003c] text-sm truncate">{item.product.name}</h5>
                    <div className="flex justify-between items-center mt-0.5">
                      <div className="text-gray-600 text-sm">
                        <span className="font-medium">{item.quantity}</span> x {formatPrice(item.product.price)}
                      </div>
                      <div className="font-bold text-[#b8003c] text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-b pb-3 bg-white rounded">
            <h4 className="font-bold mb-2 text-sm">Thông tin thanh toán:</h4>
            <div className="space-y-1 text-sm">
              <div>
                <p className="text-black">Phương thức thanh toán:</p>
                <p className="font-bold mb-2 text-sm text-gray-900">{paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}</p>
              </div>
              <div className="flex justify-between items-center pt-1">
                <p className="font-bold mb-2 text-sm text-black">Tổng cộng:</p>
                <p className="text-lg font-bold text-[#b8003c]">{formatPrice(total)}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center space-y-1">
            <p className="text-sm text-gray-600">Cảm ơn quý khách đã đặt hàng!</p>
            <p className="text-sm text-gray-600">Chúng tôi sẽ liên hệ với quý khách trong thời gian sớm nhất.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 