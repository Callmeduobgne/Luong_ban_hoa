import { create } from 'zustand'
import apiClient from '@/shared/services/api-client'
import { toast } from 'react-hot-toast'

interface CartItem {
  id: string
  product: {
    id: string
    name: string
    price: number
    image: string
    category: 'birthday' | 'wedding' | 'funeral' | 'gift' | 'congratulation'
    flowerType: 'rose' | 'carnation' | 'orchid' | 'lily' | 'mixed'
    originalPrice?: number
    discount?: number
    rating?: number
    reviewCount?: number
    isNew?: boolean
    isBestSeller?: boolean
  }
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product: CartItem['product'], quantity: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalAmount: () => number
  fetchCartFromBackend: () => Promise<void>
  syncCartToBackend: () => Promise<void>
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product, quantity) => {
    set((state) => {
      const existingItem = state.items.find(item => item.product.id === product.id)
      let newItems
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        newItems = [...state.items, { id: Date.now().toString(), product, quantity }]
      }
      setTimeout(() => {
        get().syncCartToBackend()
      }, 0)
      return { items: newItems }
    })
    toast.success('Đã thêm vào giỏ hàng!')
  },
  removeItem: (id) => {
    set((state) => {
      const newItems = state.items.filter(item => item.id !== id)
      setTimeout(() => {
        get().syncCartToBackend()
      }, 0)
      return { items: newItems }
    })
    toast.success('Đã xóa khỏi giỏ hàng!')
  },
  updateQuantity: (id, quantity) => {
    set((state) => {
      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
      setTimeout(() => {
        get().syncCartToBackend()
      }, 0)
      return { items: newItems }
    })
  },
  clearCart: () => {
    set({ items: [] })
  },
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0)
  },
  getTotalAmount: () => {
    return get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  },
  fetchCartFromBackend: async () => {
    try {
      const response = await apiClient.get('/api/cart')
      if (response.data.success) {
        set({ items: response.data.data })
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      toast.error('Không thể tải giỏ hàng')
    }
  },
  syncCartToBackend: async () => {
    try {
      const items = get().items
      await apiClient.post('/api/cart', { items })
    } catch (error) {
      console.error('Error syncing cart:', error)
      toast.error('Không thể đồng bộ giỏ hàng')
    }
  }
})) 