import { ShoppingCart, Star } from 'lucide-react'

const sampleProducts = [
  {
    id: '1',
    name: 'Bó hoa hồng đỏ lãng mạn',
    price: 450000,
    originalPrice: 500000,
    rating: 4.8,
    reviewCount: 124,
    category: 'Hoa tặng'
  },
  {
    id: '2',
    name: 'Lẵng hoa sinh nhật rực rỡ',
    price: 380000,
    rating: 4.6,
    reviewCount: 89,
    category: 'Sinh nhật'
  },
  {
    id: '3',
    name: 'Hoa cưới cầm tay cô dâu',
    price: 680000,
    rating: 4.9,
    reviewCount: 67,
    category: 'Cưới hỏi'
  },
  {
    id: '4',
    name: 'Vòng hoa chia buồn trang nghiêm',
    price: 850000,
    rating: 4.7,
    reviewCount: 34,
    category: 'Tang lễ'
  },
  {
    id: '5',
    name: 'Bó hoa lan tím thanh lịch',
    price: 650000,
    rating: 4.7,
    reviewCount: 32,
    category: 'Chúc mừng'
  },
  {
    id: '6',
    name: 'Lẵng hoa cưới trắng tinh khôi',
    price: 1200000,
    rating: 4.9,
    reviewCount: 156,
    category: 'Cưới hỏi'
  }
]

export function FeaturedProductsSimple() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Sản phẩm nổi bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá bộ sưu tập hoa tươi đẹp nhất với chất lượng cao và giá cả hợp lý
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sampleProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              {/* Product Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center">
                <div className="text-6xl">🌸</div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Category */}
                <span className="inline-block bg-orange-100 text-orange-600 text-xs font-medium px-2 py-1 rounded-full mb-2">
                  {product.category}
                </span>

                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-500 ml-1">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Thêm vào giỏ
                  </button>
                  <button className="px-4 py-2 border border-gray-300 hover:border-orange-600 text-gray-700 hover:text-orange-600 rounded-lg font-medium transition-colors duration-200">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
            Xem thêm sản phẩm
          </button>
        </div>
      </div>
    </section>
  )
} 