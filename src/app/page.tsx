import { Banner } from '@/features/products/components/banner'
import AdditionalSections from '@/features/products/components/additional-sections'
import CategoriesSection from '@/features/products/components/categories-section'
import BlogSection from '@/features/products/components/blog-section'

export default function HomePage() {
  return (
    <div className="min-h-screen page-enter" style={{ fontFamily: 'Courier New, monospace' }}>
      <Banner />
      <CategoriesSection />
      <BlogSection />
      <AdditionalSections />
    </div>
  )
}
