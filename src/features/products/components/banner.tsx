'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ShoppingCart, Star, Phone } from 'lucide-react'

const slides = [
  { 
    id: 1, 
    title: "Hoa Tươi Cao Cấp", 
    subtitle: "Mang thiên nhiên đến gần bạn", 
    promotion: "Miễn phí giao hàng tại Thái Nguyên",
    description: "Khám phá bộ sưu tập hoa tươi đẹp nhất cho mọi dịp đặc biệt trong cuộc sống",
    image: "/images/banner/banner.png",
    ctaText: "Khám phá ngay",
    ctaLink: "/products"
  },
  { 
    id: 2, 
    title: "Hoa Sinh Nhật", 
    subtitle: "Tạo nên khoảnh khắc đáng nhớ", 
    promotion: "Giảm 20% cho đơn hàng đầu tiên",
    description: "Những bó hoa sinh nhật tươi đẹp, được thiết kế đặc biệt cho ngày quan trọng",
    image: "/images/banner/banner1.png",
    ctaText: "Đặt hoa ngay",
    ctaLink: "/products/bo-hoa"
  },
  { 
    id: 3, 
    title: "Hoa Cưới Lãng Mạn", 
    subtitle: "Hoàn hảo cho ngày trọng đại", 
    promotion: "Tư vấn thiết kế miễn phí",
    description: "Hoa cưới cao cấp với thiết kế tinh tế, tạo nên ngày cưới trong mơ của bạn",
    image: "/images/banner/banner2.png",
    ctaText: "Tư vấn ngay",
    ctaLink: "/products/hop-hoa"
  }
]

export function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  useEffect(() => {
    if (!isAutoPlay) return
    const timer = setInterval(() => {
      handleSlideChange((prev) => (prev + 1) % slides.length)
    }, 6000) // Tăng thời gian để có cảm giác thư thái hơn
    return () => clearInterval(timer)
  }, [isAutoPlay])

  const handleSlideChange = (newSlide: number | ((prev: number) => number)) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide(newSlide)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 200)
  }

  const nextSlide = () => handleSlideChange((prev) => (prev + 1) % slides.length)
  const prevSlide = () => handleSlideChange((prev) => (prev - 1 + slides.length) % slides.length)
  const goToSlide = (index: number) => handleSlideChange(index)
  const currentSlideData = slides[currentSlide]

  return (
    <section 
      className="relative h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-4 h-4 bg-rose-300/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-pink-300/20 rounded-full animate-float-delay-1"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-purple-300/25 rounded-full animate-float-delay-2"></div>
        <div className="absolute top-60 left-1/3 w-5 h-5 bg-rose-200/40 rounded-full animate-float-delay-3"></div>
        <div className="absolute bottom-20 right-1/4 w-4 h-4 bg-pink-200/30 rounded-full animate-float"></div>
            </div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ec4899' fill-opacity='0.1'%3E%3Cpath d='M50 30c11.046 0 20 8.954 20 20s-8.954 20-20 20-20-8.954-20-20 8.954-20 20-20zM50 35c-8.284 0-15 6.716-15 15s6.716 15 15 15 15-6.716 15-15-6.716-15-15-15z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Main Content */}
      <div className="relative h-full">
        <div className="container mx-auto px-4 h-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center h-full py-12">
            
            {/* Left Side - Content */}
            <div className={`space-y-6 text-center lg:text-left transition-all duration-700 ease-out ${
              isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
            }`}>
              {/* Promotion Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse-gentle">
                <Star className="h-4 w-4" />
                <span>{currentSlideData.promotion}</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-3">
                <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                {currentSlideData.title}
              </h1>
                <h2 className="text-xl lg:text-2xl text-gray-600 font-light italic">
                {currentSlideData.subtitle}
              </h2>
              </div>
              
              {/* Description */}
              <p className="text-lg text-gray-600 max-w-md mx-auto lg:mx-0 leading-relaxed font-light">
                {currentSlideData.description}
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
                <Link 
                  href={currentSlideData.ctaLink}
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-medium text-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl"
                >
                  <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                  {currentSlideData.ctaText}
                </Link>
                
                <Link 
                  href="tel:0987654321"
                  className="group inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white text-rose-500 border border-rose-300 hover:border-rose-400 px-8 py-4 rounded-2xl font-medium text-lg transition-all duration-500 shadow-md hover:shadow-lg"
                >
                  <Phone className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  Gọi ngay
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200/50">
                <div className="text-center group">
                  <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">500+</div>
                  <div className="text-sm text-gray-500 font-light">Mẫu hoa</div>
                </div>
                <div className="text-center group">
                  <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">24/7</div>
                  <div className="text-sm text-gray-500 font-light">Hỗ trợ</div>
                </div>
                <div className="text-center group">
                  <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">2h</div>
                  <div className="text-sm text-gray-500 font-light">Giao hàng</div>
                </div>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="relative h-[300px] lg:h-[450px] order-first lg:order-last">
              <div className="relative h-full w-full">
                {slides.map((slide, index) => (
                  <div 
                    key={slide.id} 
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      index === currentSlide 
                        ? 'opacity-100 scale-100 rotate-0' 
                        : 'opacity-0 scale-105 rotate-1'
                    }`}
                  >
                    <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl bg-white p-2">
                      <div className="relative h-full w-full rounded-2xl overflow-hidden">
                        <Image 
                          src={slide.image} 
                          alt={slide.title} 
                          fill 
                          className="object-cover transition-transform duration-1000 hover:scale-105"
                          priority={index === 0} 
                          sizes="(max-width: 1024px) 100vw, 50vw" 
                        />
                        {/* Soft Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative Floating Elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-rose-300 to-pink-400 rounded-full flex items-center justify-center text-white text-3xl shadow-xl animate-float opacity-80">
                🌸
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full flex items-center justify-center text-white text-2xl shadow-xl animate-float-delay-1 opacity-80">
                💐
              </div>
              <div className="absolute top-1/2 -right-4 w-12 h-12 bg-gradient-to-br from-purple-300 to-rose-400 rounded-full flex items-center justify-center text-white text-lg shadow-lg animate-float-delay-2 opacity-70">
                🌺
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide} 
        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/70 backdrop-blur-md hover:bg-white/90 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 group"
      >
        <ChevronLeft className="h-6 w-6 text-gray-600 group-hover:text-rose-500 transition-colors" />
      </button>

      <button 
        onClick={nextSlide} 
        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/70 backdrop-blur-md hover:bg-white/90 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 group"
      >
        <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-rose-500 transition-colors" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button 
            key={index} 
            onClick={() => goToSlide(index)} 
            className={`h-3 rounded-full transition-all duration-500 ${
              index === currentSlide 
                ? 'bg-gradient-to-r from-rose-400 to-pink-500 w-10 shadow-lg' 
                : 'bg-white/60 hover:bg-white/80 w-3 hover:w-6'
            }`} 
          />
        ))}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-1deg); }
        }
        @keyframes float-delay-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(-1deg); }
          66% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes float-delay-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-6px) rotate(2deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }
        @keyframes float-delay-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(-2deg); }
          66% { transform: translateY(-4px) rotate(1deg); }
        }
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay-1 { animation: float-delay-1 8s ease-in-out infinite; }
        .animate-float-delay-2 { animation: float-delay-2 7s ease-in-out infinite; }
        .animate-float-delay-3 { animation: float-delay-3 9s ease-in-out infinite; }
        .animate-pulse-gentle { animation: pulse-gentle 4s ease-in-out infinite; }
      `}</style>
    </section>
  )
}
