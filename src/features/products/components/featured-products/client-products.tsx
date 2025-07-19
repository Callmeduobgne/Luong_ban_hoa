"use client"
import { ProductCard } from './product-card'
import type { Product } from '../featured-products-section'

interface ClientProductsProps {
  products: Product[]
}

export default function ClientProducts({ products }: ClientProductsProps) {
  return (
    <>
      {products.map((product: Product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </>
  )
} 