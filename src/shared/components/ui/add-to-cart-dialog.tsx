import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import ProductImage from './product-image'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  image: string
  description?: string
  category: 'birthday' | 'wedding' | 'funeral' | 'gift' | 'congratulation'
  flowerType: 'rose' | 'carnation' | 'orchid' | 'lily' | 'mixed'
  originalPrice?: number
  discount?: number
  rating?: number
  reviewCount?: number
  isNew?: boolean
  isBestSeller?: boolean
}

interface AddToCartDialogProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAdd: (product: Product, quantity: number) => void
}

export default function AddToCartDialog({ product, isOpen, onClose, onAdd }: AddToCartDialogProps) {
  const [quantity, setQuantity] = useState(1)
  if (!product) return null

  const handleAdd = () => {
    onAdd(product, quantity)
    setQuantity(1)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-3/4 max-w-4xl mx-auto min-h-[500px]" aria-describedby="add-to-cart-desc">
        <div className="flex flex-col md:flex-row gap-8 h-full">
          {/* Ảnh sản phẩm lớn */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-full h-80 md:h-[420px] bg-gray-100 rounded-2xl overflow-hidden">
              <ProductImage src={product.image} alt={product.name} fill className="object-contain" />
            </div>
          </div>
          {/* Thông tin và thao tác */}
          <div className="flex-1 flex flex-col justify-between py-2">
            {/* Giá tiền góc trái trên */}
            <div className="mb-6">
              <div className="text-orange-600 font-bold text-2xl mb-2">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900 mb-2">{product.name}</DialogTitle>
                <DialogDescription id="add-to-cart-desc">Chọn số lượng và xác nhận thêm sản phẩm vào giỏ hàng.</DialogDescription>
              </DialogHeader>
              <div className="text-gray-700 text-base mb-4 line-clamp-3">{product.description}</div>
            </div>
            {/* Chọn số lượng và tổng */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-8 h-8 rounded bg-gray-200 text-lg font-bold">-</button>
                  <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="w-8 h-8 rounded bg-gray-200 text-lg font-bold">+</button>
                </div>
              </div>
              <div className="text-gray-700 text-lg">Tổng: <span className="font-semibold text-orange-600">{(product.price * quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></div>
              <DialogFooter>
                <button onClick={handleAdd} className="w-full bg-[#ffbec8] hover:bg-[#ff8fa3] text-white px-6 py-3 rounded-lg font-semibold transition-colors">Thêm vào giỏ hàng</button>
              </DialogFooter>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export type { Product } 