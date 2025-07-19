'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Package, Gift, Flower2 } from 'lucide-react'

const categories = [
  {
    id: 'bo-hoa',
    name: 'Bó Hoa',
    description: 'Bó hoa tươi đẹp cho mọi dịp đặc biệt',
    image: '/images/sanpham/sanpham1.png',
    icon: Flower2,
    count: '150+ mẫu',
    href: '/products/bo-hoa',
    gradient: 'from-rose-400 to-pink-500',
    bgColor: 'bg-rose-50'
  },
  {
    id: 'hop-hoa',
    name: 'Hộp Hoa',
    description: 'Hộp hoa cao cấp sang trọng và tinh tế',
    image: '/images/sanpham/sanpham2.png',
    icon: Package,
    count: '80+ mẫu',
    href: '/products/hop-hoa',
    gradient: 'from-purple-400 to-pink-500',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'hoa-trang-tri',
    name: 'Hoa Trang Trí',
    description: 'Hoa trang trí không gian đẹp mắt',
    image: '/images/sanpham/sanpham3.png',
    icon: Gift,
    count: '120+ mẫu',
    href: '/products/hoa-trang-tri',
    gradient: 'from-emerald-400 to-teal-500',
    bgColor: 'bg-emerald-50'
  }
]

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-rose-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 fade-in-down gradient-text">
            🌸 Danh Mục Sản Phẩm 🌸
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto fade-in-up gentle-wave">
            Khám phá các loại hoa tươi đẹp nhất tại N07.floral - Luong Ban Hoa
          </p>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Link
                key={category.id}
                href={category.href}
                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-rose-200 hover-lift fade-in-up stagger-${index + 1}`}
              >
                {/* Background Pattern */}
                <div className={`absolute inset-0 ${category.bgColor} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}></div>
                
                {/* Category Image */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={true}
                  />
                  
                  {/* Floating icon */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className={`w-12 h-12 bg-gradient-to-r ${category.gradient} rounded-full flex items-center justify-center shadow-lg rotate-flower`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Count badge */}
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                      {category.count}
                    </span>
                  </div>
                </div>
                
                {/* Category Info */}
                <div className="relative p-6 z-10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  
                  <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                    {category.description}
                  </p>
                  
                  {/* Action Button */}
                  <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${category.gradient} text-white px-4 py-2 rounded-full font-semibold text-sm shadow-md group-hover:shadow-lg transform group-hover:scale-105 transition-all duration-300`}>
                    <span>Xem ngay</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/10 to-transparent rounded-tl-2xl"></div>
              </Link>
            )
          })}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-gray-600 mb-4">
            <span className="text-2xl">🌺</span>
            <span className="font-medium">Hoặc xem tất cả sản phẩm</span>
            <span className="text-2xl">🌺</span>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover-glow"
          >
            <span>Khám phá tất cả</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
} 