import Link from 'next/link'
import { ShoppingCart, ArrowRight, Heart } from 'lucide-react'

export function BannerSimple() {
  return (
    <section className="relative h-[500px] bg-gradient-to-br from-orange-100 via-rose-50 to-orange-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-300 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-rose-300 rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-orange-400 rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-rose-200 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Promotion Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full text-lg font-medium">
              <Heart className="h-5 w-5" />
              <span>Giao hoa miễn phí tại Thái Nguyên</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Gửi yêu thương qua những
              <span className="text-orange-600 block">đóa hoa tươi thắm</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-gray-700 max-w-2xl mx-auto">
              Flower Corner - Chuyên cung cấp hoa tươi cao cấp tại Thái Nguyên
            </p>
            
            {/* Description */}
            <p className="text-lg text-gray-600 max-w-lg mx-auto">
              Khám phá bộ sưu tập hoa tươi đẹp nhất cho mọi dịp đặc biệt. 
              Thiết kế theo yêu cầu, giao hàng nhanh chóng.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <ShoppingCart className="h-6 w-6" />
                Đặt hoa ngay
              </Link>
              
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-300 border-2 border-orange-600"
              >
                Xem sản phẩm
                <ArrowRight className="h-6 w-6" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">500+</div>
                <div className="text-sm text-gray-600">Mẫu hoa</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">24/7</div>
                <div className="text-sm text-gray-600">Hỗ trợ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">2h</div>
                <div className="text-sm text-gray-600">Giao hàng</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
        <div className="text-sm text-gray-600">Hotline:</div>
        <div className="text-lg font-semibold text-orange-600">0987.654.321</div>
      </div>
    </section>
  )
} 