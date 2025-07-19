'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Star } from 'lucide-react'
import ProductImage from './product-image'
import AvatarImage from './avatar-image'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
}

interface ProductDetailDialogProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductDetailDialog({ product, isOpen, onClose }: ProductDetailDialogProps) {
  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl" aria-describedby="product-detail-desc">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">{product.name}</DialogTitle>
          <DialogDescription id="product-detail-desc">Xem chi tiết sản phẩm, giá và mô tả.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative w-full h-96 bg-gray-100 rounded-2xl overflow-hidden">
            <ProductImage 
              src={product.image} 
              alt={product.name} 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-4">
            <div className="text-orange-600 font-bold text-2xl">
              {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </div>
            <p className="text-lg text-gray-700">{product.description}</p>
            <button className="w-full bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 