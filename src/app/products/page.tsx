'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Filter, Search, Grid, List, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/features/cart/hooks/cart-store'
import { useAuth } from '@/features/auth/hooks/auth-context'
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

const categories = [
  { id: 'all', name: 'Tất cả', count: 0 },
  { id: 'bo-hoa', name: 'Bó Hoa', count: 0 },
  { id: 'hop-hoa', name: 'Hộp Hoa', count: 0 },
  { id: 'hoa-trang-tri', name: 'Hoa Trang Trí', count: 0 },
  { id: 'hoa-cuoi', name: 'Hoa Cưới', count: 0 },
  { id: 'hoa-sinh-nhat', name: 'Hoa Sinh Nhật', count: 0 },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('name')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const searchParams = useSearchParams()
  const addItem = useCartStore((state) => state.addItem)
  const { isLoggedIn, openAuthPopup } = useAuth()

  // Lấy category từ URL params
  useEffect(() => {
    const categoryParam = searchParams?.get('category')
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  // Fetch products
  useEffect(() => {
    setIsLoading(true)
    fetch('http://localhost:5003/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data.products || [])
        }
        setIsLoading(false)
      })
      .catch(() => {
        setProducts([])
        setIsLoading(false)
      })
  }, [])

  // Filter and search products
  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category === selectedCategory
      )
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }, [products, selectedCategory, searchQuery, sortBy])

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

  const handleModalAddToCart = (product: Product, quantity: number) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0] || '/images/placeholder.png',
      category: 'gift' as any,
      flowerType: 'mixed' as any,
    }, quantity)
    toast.success('Đã thêm vào giỏ hàng!')
    setIsModalOpen(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-spin">🌸</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang tải sản phẩm...</h2>
            <p className="text-gray-600">Vui lòng đợi một chút nhé!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Về trang chủ
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm hoa tươi</h1>
          <p className="text-gray-600">Khám phá bộ sưu tập hoa tươi đẹp nhất tại N07.floral</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-rose-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort and View Options */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="name">Sắp xếp theo tên</option>
                <option value="price-low">Giá: Thấp đến cao</option>
                <option value="price-high">Giá: Cao đến thấp</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} sản phẩm
              </span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-rose-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-rose-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🌸</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-lg text-gray-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex items-center p-4' : 'flex flex-col'
                }`}
              >
                {/* Product Image */}
                <div className={`relative overflow-hidden rounded-lg ${
                  viewMode === 'list' ? 'w-24 h-24 flex-shrink-0 mr-4' : 'aspect-square mb-4'
                }`}>
                  <Image
                    src={product.image || product.images?.[0] || '/images/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes={viewMode === 'list' ? '96px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'}
                  />
                </div>

                {/* Product Info */}
                <div className={`flex-1 ${viewMode === 'grid' ? 'p-4' : ''}`}>
                  <h3 className={`font-semibold text-gray-900 mb-2 ${
                    viewMode === 'list' ? 'text-lg' : 'text-base'
                  }`}>
                    {product.name}
                  </h3>
                  
                  {viewMode === 'list' && product.description && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className={`flex items-center ${
                    viewMode === 'list' ? 'justify-between' : 'justify-between'
                  }`}>
                    <span className="text-lg font-bold text-rose-600">
                      {formatPrice(product.price)}
                    </span>

                    <div className="flex gap-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="px-3 py-1 text-sm border border-gray-300 hover:border-rose-500 text-gray-700 hover:text-rose-500 rounded-lg transition-colors"
                      >
                        Xem
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-3 py-1 text-sm bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors flex items-center gap-1"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            category: 'gift' as any,
            flowerType: 'mixed' as any,
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