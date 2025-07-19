'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Thị Lan",
    location: "Thái Nguyên",
    rating: 5,
    comment: "Hoa rất tươi và đẹp, giao hàng đúng giờ. Mình đặt hoa sinh nhật cho bạn và cả hai đều rất hài lòng. Sẽ tiếp tục ủng hộ shop!",
    occasion: "Hoa sinh nhật",
    image: "/images/testimonials/customer1.jpg",
    productImage: "/images/products/birthday-bouquet.jpg"
  },
  {
    id: 2,
    name: "Trần Văn Minh",
    location: "Hà Nội",
    rating: 5,
    comment: "Đặt hoa online giao về quê Thái Nguyên cho mẹ. Chất lượng hoa tuyệt vời, đóng gói cẩn thận. Mẹ rất thích!",
    occasion: "Hoa tặng mẹ",
    image: "/images/testimonials/customer2.jpg",
    productImage: "/images/products/mothers-day.jpg"
  },
  {
    id: 3,
    name: "Lê Thị Hương",
    location: "TP.HCM",
    rating: 5,
    comment: "Lần đầu đặt hoa online, ban đầu hơi lo lắng nhưng kết quả vượt ngoài mong đợi. Hoa đẹp hơn cả ảnh, nhân viên tư vấn nhiệt tình.",
    occasion: "Hoa khai trương",
    image: "/images/testimonials/customer3.jpg",
    productImage: "/images/products/grand-opening.jpg"
  },
  {
    id: 4,
    name: "Phạm Đức Thành",
    location: "Thái Nguyên",
    rating: 5,
    comment: "Đặt hoa cưới cho em gái, thiết kế theo yêu cầu rất đẹp và ý nghĩa. Cảm ơn team đã tạo ra những khoảnh khắc đáng nhớ!",
    occasion: "Hoa cưới",
    image: "/images/testimonials/customer4.jpg",
    productImage: "/images/products/wedding-bouquet.jpg"
  },
  {
    id: 5,
    name: "Vũ Thị Mai",
    location: "Bắc Giang",
    rating: 5,
    comment: "Hoa tươi lâu, màu sắc đẹp. Đặc biệt là dịch vụ chăm sóc khách hàng rất tốt, luôn sẵn sàng hỗ trợ và tư vấn.",
    occasion: "Hoa valentine",
    image: "/images/testimonials/customer5.jpg",
    productImage: "/images/products/valentine-roses.jpg"
  }
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ của Flower Corner
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">5000+</div>
            <div className="text-gray-600">Khách hàng hài lòng</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Đánh giá trung bình</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
            <div className="text-gray-600">Giao hàng đúng hẹn</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600">Hỗ trợ khách hàng</div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Quote Icon */}
            <div className="flex justify-center mb-6">
              <Quote className="w-12 h-12 text-orange-200" />
            </div>

            {/* Current Testimonial */}
            <div className="text-center">
              {/* Rating */}
              <div className="flex justify-center mb-4">
                {renderStars(testimonials[currentIndex].rating)}
              </div>

              {/* Comment */}
              <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 italic">
                "{testimonials[currentIndex].comment}"
              </blockquote>

              {/* Customer Info */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                {/* Avatar */}
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-lg">
                    {testimonials[currentIndex].name.charAt(0)}
                  </span>
                </div>

                {/* Details */}
                <div className="text-center md:text-left">
                  <div className="font-semibold text-gray-900 text-lg">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentIndex].location} • {testimonials[currentIndex].occasion}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-300"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex ? 'bg-orange-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Bạn cũng muốn trải nghiệm dịch vụ tuyệt vời này?
          </p>
          <button 
            className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300"
          >
            Đặt hoa ngay
          </button>
        </div>
      </div>
    </section>
  )
} 