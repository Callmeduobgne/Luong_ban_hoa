'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProductImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  sizes?: string
}

export default function ProductImage({ src, alt, className = '', fill = false, sizes }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src || '/images/placeholder.png')

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      onError={() => {
        setImgSrc('/images/placeholder.png')
      }}
    />
  )
} 