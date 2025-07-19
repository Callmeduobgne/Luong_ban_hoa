'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import ProductDetailDialog from '@/components/ui/product-detail-dialog'
import AddToCartDialog, { Product as AddToCartProduct } from '@/components/ui/add-to-cart-dialog'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cart-store'
import axios from 'axios'
import { useAuth } from '@/contexts/auth-context'

export interface Product {
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

function formatPrice(price: number) {
  return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [cartDialogProduct, setCartDialogProduct] = useState<any | null>(null)
  const [cartDialogOpen, setCartDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)
  const { isLoggedIn, openAuthPopup } = useAuth()

  useEffect(() => {
    setIsLoading(true)
    axios.get('http://localhost:5003/api/products')
      .then(res => {
        setProducts(res.data.data.products)
        setIsLoading(false)
      })
      .catch(() => {
        setProducts([])
        setIsLoading(false)
      })
  }, [])

  const handleAddToCart = (product: Product, quantity: number) => {
    if (!isLoggedIn) {
      openAuthPopup('login')
      return
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      flowerType: product.flowerType,
      originalPrice: product.originalPrice,
      discount: product.discount,
      rating: product.rating,
      reviewCount: product.reviewCount,
      isNew: product.isNew,
      isBestSeller: product.isBestSeller
    }, quantity)
    toast.success('Đã thêm vào giỏ hàng, bạn nhớ kiểm tra nhé')
  }

  // Loading component với animation
  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 fade-in-down">Sản phẩm nổi bật</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto fade-in-up">Khám phá những mẫu hoa được yêu thích nhất tại shop</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col animate-pulse stagger-${(index % 6) + 1}`}>
                <div className="w-full h-72 bg-gray-200 rounded-t-2xl shimmer"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2 shimmer"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4 shimmer"></div>
                  <div className="h-8 bg-gray-200 rounded shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-rose-50 to-white floating-petals">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 fade-in-down gradient-text">
            🌸 Sản phẩm nổi bật 🌸
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto fade-in-up gentle-wave">
            Khám phá những mẫu hoa được yêu thích nhất tại shop với thiết kế tinh tế và chất lượng cao cấp
          </p>
        </div>
        
        <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className={`product-card bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col hover-lift card-lift relative overflow-hidden group fade-in-up stagger-${(index % 6) + 1}`}
            >
              {/* Floating flower indicator */}
              <div className="absolute top-4 right-4 z-10 rotate-flower">
                🌺
              </div>
              
              {/* Product image with hover effects */}
              <div className="product-card-bg relative w-full h-72 aspect-[4/3] rounded-t-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <Image 
                  src={product.image || product.images?.[0] || '/images/placeholder.png'} 
                  alt={product.name} 
                  fill 
                  className="object-contain group-hover:scale-110 transition-transform duration-500 flower-bloom" 
                  sizes="(max-width: 768px) 100vw, 25vw" 
                />
                
                {/* Quick view overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                  <button 
                    className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-rose-100 spring-bounce"
                    onClick={() => { setCartDialogProduct(product); setCartDialogOpen(true); }}
                  >
                    Xem nhanh 👁️
                  </button>
                </div>
              </div>
              
              {/* Product info */}
              <div className="flex-1 flex flex-col p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center font-playfair group-hover:text-rose-600 transition-colors duration-300">
                  {product.name}
                </h3>
                
                <div className="product-card-info text-rose-600 font-bold text-xl mb-4 text-center heartbeat">
                  {formatPrice(product.price)}
                </div>
                
                <div className="mt-auto flex justify-center">
                  <button
                    className="bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold px-4 py-2 rounded-full text-sm hover:from-rose-500 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 pulse-gentle hover-glow shadow-lg"
                    onClick={() => { setCartDialogProduct(product); setCartDialogOpen(true); }}
                  >
                    🛒 Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
              
              {/* Decorative corner */}
              <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-rose-200 to-transparent rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
        
        {/* Empty state with animation */}
        {products.length === 0 && (
          <div className="text-center py-16 fade-in-up">
            <div className="text-8xl mb-6 rotate-flower">🌸</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 gradient-text">
              Đang cập nhật sản phẩm mới
            </h3>
            <p className="text-lg text-gray-600 gentle-wave">
              Hãy quay lại sau để khám phá những mẫu hoa tuyệt đẹp nhé! 🌺
            </p>
          </div>
        )}
      </div>

             {/* Add to cart dialog */}
       {cartDialogProduct && (
      <AddToCartDialog
        isOpen={cartDialogOpen}
        onClose={() => setCartDialogOpen(false)}
           product={cartDialogProduct}
        onAdd={handleAddToCart}
      />
       )}
    </section>
  )
} 