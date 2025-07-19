'use client'

import Image from 'next/image'
import { useState } from 'react'

interface AvatarImageProps {
  src: string
  alt: string
  className?: string
}

export default function AvatarImage({ src, alt, className = '' }: AvatarImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className={className}
      onError={() => {
        setImgSrc('/images/placeholder-avatar.svg')
      }}
    />
  )
} 