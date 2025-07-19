import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram, Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">FC</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Flower Corner</h3>
                <p className="text-orange-300 text-sm">Luong Ban Hoa</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Chuyên cung cấp hoa tươi cao cấp tại Thái Nguyên. 
              Gửi yêu thương qua những đóa hoa tươi thắm nhất.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/FlowerCornerThaiNguyen" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/flowercorner_tn" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Thông tin liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    Thành phố Thái Nguyên<br />
                    Tỉnh Thái Nguyên, Việt Nam
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <div>
                  <a 
                    href="tel:0987654321" 
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300"
                  >
                    0987.654.321
                  </a>
                  <p className="text-sm text-gray-400">Hotline 24/7</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <div>
                  <a 
                    href="mailto:info@n07floral.vn" 
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300"
                  >
                    info@n07floral.vn
                  </a>
                  <p className="text-sm text-gray-400">Hỗ trợ khách hàng</p>
                </div>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Chính sách</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/chinh-sach-giao-hang" 
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center"
                >
                  🚚 Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link 
                  href="/chinh-sach-doi-tra" 
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center"
                >
                  🔄 Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link 
                  href="/dieu-khoan-su-dung" 
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center"
                >
                  📋 Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link 
                  href="/chinh-sach-bao-mat" 
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center"
                >
                  🔒 Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/ve-chung-toi" 
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center"
                >
                  ℹ️ Về chúng tôi
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center"
                >
                  ❓ Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link 
                  href="/huong-dan-dat-hoa" 
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center"
                >
                  📝 Hướng dẫn đặt hoa
                </Link>
              </li>
              <li>
                <Link 
                  href="/tin-tuc" 
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center"
                >
                  📰 Tin tức & khuyến mãi
                </Link>
              </li>
              <li>
                <Link 
                  href="/lien-he" 
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center"
                >
                  📞 Liên hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Service Highlights */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-orange-400">🚚</span>
              <span className="text-gray-300 text-sm">Giao hàng cùng ngày tại Thái Nguyên</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-orange-400">🌍</span>
              <span className="text-gray-300 text-sm">Giao hàng toàn quốc 1-3 ngày</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-orange-400">💳</span>
              <span className="text-gray-300 text-sm">Thanh toán COD, chuyển khoản</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>© 2025 N07.floral - Flower Corner. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm mt-2 md:mt-0">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>in Thái Nguyên</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 