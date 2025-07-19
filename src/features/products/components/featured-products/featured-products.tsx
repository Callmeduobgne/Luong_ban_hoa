"use client"
import dynamic from "next/dynamic"
import React, { useState, useMemo } from "react"
import { ProductFilters } from "./product-filters"
import products from "@/shared/constants/products"
import type { Product } from "@/shared/types/product"

const ClientProducts = dynamic(() => import("./client-products"), { ssr: false })

export function FeaturedProducts() {
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all")
  const [selectedFlowerType, setSelectedFlowerType] = useState<string>("all")
  const [showAll, setShowAll] = useState(false)

  const filteredProducts = useMemo<Product[]>(
    () =>
      products.filter((p: Product) =>
        (selectedOccasion === "all" || p.category === selectedOccasion) &&
        (selectedFlowerType === "all" || p.flowerType === selectedFlowerType)
      ),
    [selectedOccasion, selectedFlowerType]
  )
  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, 8)

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Sản phẩm nổi bật</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Khám phá những bó hoa đẹp nhất tại N07.floral - Luong Ban Hoa. Hoa tươi cao cấp cho mọi dịp đặc biệt của bạn.
          </p>
        </div>
        <div className="mb-12">
          <ProductFilters
            selectedOccasion={selectedOccasion}
            selectedFlowerType={selectedFlowerType}
            onOccasionChange={setSelectedOccasion}
            onFlowerTypeChange={setSelectedFlowerType}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10 mb-16">
          <ClientProducts products={displayedProducts} />
        </div>
        {filteredProducts.length > 8 && !showAll && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Xem thêm sản phẩm ({filteredProducts.length - 8} sản phẩm)
            </button>
          </div>
        )}
        {showAll && filteredProducts.length > 8 && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Thu gọn
            </button>
          </div>
        )}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🌸</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h3>
            <p className="text-lg text-gray-600">Thử thay đổi bộ lọc để xem thêm sản phẩm khác</p>
          </div>
        )}
      </div>
    </section>
  )
}
