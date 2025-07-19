import { Truck, Clock, Palette } from 'lucide-react'

const services = [
  {
    icon: Clock,
    title: "Giao hoa cùng ngày",
    description: "Giao hàng nhanh chóng trong ngày tại TP Thái Nguyên",
    highlight: "Miễn phí giao hàng"
  },
  {
    icon: Truck,
    title: "Giao hàng toàn quốc",
    description: "Phục vụ giao hàng khắp 63 tỉnh thành Việt Nam",
    highlight: "An toàn & đúng hẹn"
  },
  {
    icon: Palette,
    title: "Tùy chỉnh theo yêu cầu",
    description: "Thiết kế hoa độc đáo theo ý tưởng của bạn",
    highlight: "Tư vấn miễn phí"
  }
]

export default function ServicesSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-orange-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dịch vụ nổi bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cam kết mang đến trải nghiệm mua sắm hoa tươi tốt nhất với dịch vụ chuyên nghiệp
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors duration-300">
                  <IconComponent className="w-8 h-8 text-orange-600" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Highlight Badge */}
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    ✓ {service.highlight}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-orange-600 text-white rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Cần hỗ trợ tư vấn?
            </h3>
            <p className="text-orange-100 mb-6">
              Liên hệ ngay với chúng tôi để được tư vấn miễn phí về dịch vụ hoa tươi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:0987654321"
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300"
              >
                📞 Gọi ngay: 0987.654.321
              </a>
              <a 
                href="#contact"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors duration-300"
              >
                💬 Chat với chúng tôi
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 