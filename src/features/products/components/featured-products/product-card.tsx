'use client';

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { useState } from 'react'
import AddToCartModal from '@/components/ui/add-to-cart-modal'

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  category: 'birthday' | 'wedding' | 'funeral' | 'gift' | 'congratulation'
  flowerType: 'rose' | 'carnation' | 'orchid' | 'lily' | 'mixed'
  rating?: number
  reviewCount?: number
  isNew?: boolean
  isBestSeller?: boolean
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  discount,
  image,
  category,
  flowerType,
  rating = 0,
  reviewCount = 0,
  isNew = false,
  isBestSeller = false
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      birthday: 'Sinh nhật',
      wedding: 'Cưới hỏi',
      funeral: 'Tang lễ',
      gift: 'Quà tặng',
      congratulation: 'Chúc mừng'
    }
    return labels[category as keyof typeof labels] || category
  }

  // Convert to modal product format
  const modalProduct = {
    id,
    name,
    price,
    originalPrice,
    image,
    category,
    flowerType,
    rating: rating || 4.5,
    reviewCount: reviewCount || 0,
    isNew,
    isBestSeller,
    discount,
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200 h-full flex flex-col">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {isNew && (
            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              Mới
            </span>
          )}
          {isBestSeller && (
            <span className="bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              Bán chạy
            </span>
          )}
          {discount && (
            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm">
          <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
        </button>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Link href={`/products/${id}`}>
            <Image
              src={image || '/images/placeholder.png'}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </Link>
        </div>

        {/* Product Info */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Category */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-primary-600 bg-primary-50 px-3 py-1 rounded-full font-semibold">
              {getCategoryLabel(category)}
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/products/${id}`}>
            <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 hover:text-primary-600 transition-colors text-lg">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">
                {rating} ({reviewCount} đánh giá)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-6 mt-auto">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <ShoppingCart className="h-4 w-4" />
              Thêm vào giỏ
            </button>
            <Link
              href={`/products/${id}`}
              className="px-4 py-3 border-2 border-gray-300 hover:border-primary-600 text-gray-700 hover:text-primary-600 rounded-xl font-semibold transition-all duration-200 hover:bg-primary-50"
            >
              Xem
            </Link>
          </div>
        </div>
      </div>

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={modalProduct}
      />
    </>
  )
} 