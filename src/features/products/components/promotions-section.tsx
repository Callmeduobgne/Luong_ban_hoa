'use client'

import { useState, useEffect } from 'react'
import { Gift, Percent, Clock, Users, ArrowRight, Sparkles } from 'lucide-react'

const promotions = [
  {
    id: 1,
    type: "Khách hàng mới",
    title: "Giảm 20% đơn hàng đầu tiên",
    description: "Chào mừng bạn đến với Flower Corner! Nhận ngay ưu đãi đặc biệt cho lần mua sắm đầu tiên.",
    discount: "20%",
    code: "WELCOME20",
    icon: Users,
    color: "from-blue-500 to-purple-600",
    validUntil: "31/12/2024",
    minOrder: "200.000đ"
  },
  {
    id: 2,
    type: "Flash Sale",
    title: "Miễn phí giao hàng toàn quốc",
    description: "Áp dụng cho tất cả đơn hàng từ 500.000đ. Giao hàng nhanh chóng, an toàn đến tận nơi.",
    discount: "FREE",
    code: "FREESHIP",
    icon: Gift,
    color: "from-green-500 to-emerald-600",
    validUntil: "15/01/2025",
    minOrder: "500.000đ"
  },
  {
    id: 3,
    type: "Combo Deal",
    title: "Mua 2 tặng 1 thiệp chúc mừng",
    description: "Mua 2 bó hoa bất kỳ và nhận miễn phí 1 thiệp chúc mừng cao cấp được thiết kế riêng.",
    discount: "1+1",
    code: "COMBO21",
    icon: Percent,
    color: "from-orange-500 to-red-600",
    validUntil: "20/01/2025",
    minOrder: "300.000đ"
  }
]

const flashSaleItems = [
  {
    name: "Bó hoa hồng đỏ 12 bông",
    originalPrice: "450.000đ",
    salePrice: "350.000đ",
    discount: "22%",
    timeLeft: "2:45:30"
  },
  {
    name: "Lẵng hoa chúc mừng",
    originalPrice: "680.000đ", 
    salePrice: "520.000đ",
    discount: "24%",
    timeLeft: "1:20:15"
  },
  {
    name: "Hộp hoa sinh nhật",
    originalPrice: "320.000đ",
    salePrice: "250.000đ",
    discount: "22%",
    timeLeft: "3:10:45"
  }
]

export default function PromotionsSection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Ưu đãi đặc biệt
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Khuyến mãi hấp dẫn
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Đừng bỏ lỡ những ưu đãi tuyệt vời dành riêng cho bạn
          </p>
        </div>

        {/* Flash Sale Banner */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-6 md:p-8 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-medium">FLASH SALE</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  Giảm đến 30% - Chỉ hôm nay!
                </h3>
                <p className="text-pink-100">
                  Hàng trăm sản phẩm hoa tươi với giá ưu đãi không thể bỏ lỡ
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-sm mb-2">Kết thúc sau:</div>
                <div className="flex gap-2">
                  <div className="bg-white/20 rounded-lg p-2 min-w-[50px]">
                    <div className="text-xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                    <div className="text-xs">Giờ</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-2 min-w-[50px]">
                    <div className="text-xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                    <div className="text-xs">Phút</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-2 min-w-[50px]">
                    <div className="text-xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                    <div className="text-xs">Giây</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Promotions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {promotions.map((promo) => {
            const IconComponent = promo.icon
            return (
              <div key={promo.id} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${promo.color} rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  {/* Badge */}
                  <div className="absolute -top-3 left-6">
                    <span className={`bg-gradient-to-r ${promo.color} text-white px-4 py-1 rounded-full text-sm font-medium`}>
                      {promo.type}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${promo.color} rounded-full flex items-center justify-center mb-6 mt-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {promo.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {promo.description}
                    </p>

                    {/* Promo Details */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mã giảm giá:</span>
                        <span className="font-mono font-bold text-orange-600">{promo.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Đơn tối thiểu:</span>
                        <span className="font-semibold">{promo.minOrder}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Có hiệu lực đến:</span>
                        <span className="font-semibold">{promo.validUntil}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className={`w-full bg-gradient-to-r ${promo.color} text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}>
                      Sử dụng ngay
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-orange-600 to-rose-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Đăng ký nhận thông tin khuyến mãi
          </h3>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Là người đầu tiên biết về các chương trình ưu đãi đặc biệt và sản phẩm mới
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300">
              Đăng ký
            </button>
          </div>
          
          <p className="text-orange-200 text-sm mt-4">
            * Chúng tôi cam kết không spam và bảo mật thông tin của bạn
          </p>
        </div>
      </div>
    </section>
  )
} 