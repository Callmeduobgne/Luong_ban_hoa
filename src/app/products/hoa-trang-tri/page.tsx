'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, Heart, Flower2 } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useAuth } from '@/contexts/auth-context'
import AddToCartModal from '@/components/ui/add-to-cart-modal'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  price: number
  image?: string
  images?: string[]
  category?: string
  description?: string
}

export default function HoaTrangTriPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const addItem = useCartStore((state) => state.addItem)
  const { isLoggedIn, openAuthPopup } = useAuth()

  useEffect(() => {
    setIsLoading(true)
    fetch('http://localhost:5003/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Filter products for "hoa trang trí" category
          const hoaTrangTriProducts = data.data.products.filter((product: Product) =>
            product.category === 'hoa-trang-tri'
          )
          setProducts(hoaTrangTriProducts)
        }
        setIsLoading(false)
      })
      .catch(() => {
        setProducts([])
        setIsLoading(false)
      })
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const handleAddToCart = (product: Product) => {
    if (!isLoggedIn) {
      openAuthPopup('login')
      return
    }
    
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-spin">🌼</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang tải hoa trang trí...</h2>
            <p className="text-gray-600">Vui lòng đợi một chút nhé!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Về trang chủ
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 gradient-text">
              🌼 Hoa Trang Trí Đẹp Mắt
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bộ sưu tập hoa trang trí không gian tuyệt đẹp. Mang thiên nhiên vào ngôi nhà bạn 
              với những mẫu hoa trang trí tinh tế và ấn tượng.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🌼</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Đang cập nhật hoa trang trí mới
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Các mẫu hoa trang trí đẹp sẽ được cập nhật sớm nhất
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
            >
              Xem danh mục khác
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-emerald-200 hover-lift fade-in-up stagger-${(index % 4) + 1}`}
                >
                  {/* Wishlist Button */}
                  <div className="absolute top-4 right-4 z-10">
                    <button className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm">
                      <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
                    </button>
                  </div>

                  {/* Category Icon */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                      <Flower2 className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image || product.images?.[0] || '/images/placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-emerald-100"
                      >
                        Xem nhanh 👁️
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-emerald-600">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        Trang trí
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Thêm vào giỏ
                      </button>
                      <Link
                        href={`/products/${product.id}`}
                        className="px-4 py-2 border-2 border-gray-300 hover:border-emerald-500 text-gray-700 hover:text-emerald-500 rounded-xl font-semibold transition-all duration-200 hover:bg-emerald-50"
                      >
                        Xem
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Category Info */}
            <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🌼 Tại sao chọn hoa trang trí tại N07.floral?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-4xl mb-3">🏡</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Trang trí không gian</h3>
                  <p className="text-gray-600 text-sm">Mang thiên nhiên vào nhà, tạo không gian sống tươi mát</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🎨</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Thiết kế nghệ thuật</h3>
                  <p className="text-gray-600 text-sm">Kết hợp màu sắc và hình dáng tạo nên tác phẩm nghệ thuật</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🌿</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Bền đẹp lâu dài</h3>
                  <p className="text-gray-600 text-sm">Hoa trang trí được chăm sóc để giữ được vẻ đẹp lâu dài</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add to Cart Modal */}
      {selectedProduct && (
        <AddToCartModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={{
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            image: selectedProduct.image || selectedProduct.images?.[0] || '/images/placeholder.png',
            category: 'gift',
            flowerType: 'mixed',
            originalPrice: selectedProduct.price,
            rating: 0,
            reviewCount: 0,
            description: selectedProduct.description || ''
          }}
        />
      )}
    </div>
  )
} 