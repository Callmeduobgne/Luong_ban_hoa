interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  comment: string
  occasion: string
  image: string
  productImage?: string
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    location: 'Hà Nội',
    rating: 5,
    comment: 'Hoa rất đẹp, giao hàng đúng hẹn. Sẽ ủng hộ shop dài dài!',
    occasion: 'Sinh nhật',
    image: '/images/testimonials/user1.svg',
    productImage: '/images/products/bouquet-red-roses.svg'
  },
  {
    id: '2',
    name: 'Trần Thị B',
    location: 'TP.HCM',
    rating: 4,
    comment: 'Hoa tươi, đóng gói cẩn thận. Nhân viên nhiệt tình.',
    occasion: 'Khai trương',
    image: '/images/testimonials/user2.svg',
    productImage: '/images/products/arrangement-grand-opening.svg'
  },
  {
    id: '3',
    name: 'Lê Văn C',
    location: 'Đà Nẵng',
    rating: 5,
    comment: 'Hoa đẹp, giá hợp lý. Shop giao hàng nhanh.',
    occasion: 'Tốt nghiệp',
    image: '/images/testimonials/user3.svg',
    productImage: '/images/products/bouquet-sunflower.svg'
  }
]

export default testimonials 