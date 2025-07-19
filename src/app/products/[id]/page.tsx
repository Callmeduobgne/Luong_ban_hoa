import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star, ArrowLeft } from 'lucide-react'
import products from '@/data/products'
import testimonials from '@/data/testimonials'
import ProductImage from '@/components/ui/product-image'
import AvatarImage from '@/components/ui/avatar-image'

// Mock import: bạn sẽ cần export products/testimonials từ các file tương ứng hoặc chuyển sang file data riêng

function getProductById(id: string) {
  return products.find((p) => p.id === id)
}

function getFeedbacksByProductName(productName: string) {
  return testimonials.filter((fb) => fb.occasion && productName && fb.comment && fb.productImage && fb.productImage.includes(productName.split(' ')[0].toLowerCase()))
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id)
  if (!product) return notFound()
  const feedbacks = getFeedbacksByProductName(product.name)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách sản phẩm
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative w-full h-96 bg-gray-100 rounded-2xl overflow-hidden">
          <ProductImage 
            src={product.image} 
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
          />
            </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="text-orange-600 font-bold text-2xl mb-4">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
          <p className="text-lg text-gray-700 mb-6">{product.description}</p>
          <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-300">Thêm vào giỏ hàng</button>
              </div>
            </div>
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Feedback khách hàng</h2>
        {feedbacks.length === 0 ? (
          <div className="text-gray-500">Chưa có feedback cho sản phẩm này.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="bg-white rounded-xl shadow p-6 flex gap-4">
                <div className="w-20 h-20 relative flex-shrink-0 bg-gray-100 rounded-full overflow-hidden">
                  <AvatarImage 
                    src={fb.image} 
                    alt={fb.name} 
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{fb.name}</span>
                    <span className="text-sm text-gray-500">({fb.location})</span>
                </div>
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < fb.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
              </div>
                  <div className="italic text-gray-700 mb-2">"{fb.comment}"</div>
                  <div className="text-xs text-gray-500">Dịp: {fb.occasion}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      <div className="mt-12 flex gap-4">
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách sản phẩm
        </Link>
        <span className="text-gray-400">|</span>
        <Link 
          href="/" 
          className="text-rose-600 hover:text-rose-700 transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  )
} 