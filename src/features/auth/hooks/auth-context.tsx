'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useCartStore } from '@/features/cart/hooks/cart-store'
import apiClient from '@/shared/services/api-client'
import { toast } from 'react-hot-toast'

interface User {
  id: string
  full_name: string
  email: string
  phone: string
  role: string
  is_active: boolean
  created_at?: string
  last_login?: string
  login_count?: number
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>
  logout: () => void
  openAuthPopup: (mode: 'login' | 'register') => void
  closeAuthPopup: () => void
  authPopupOpen: boolean
  authMode: 'login' | 'register'
}

interface RegisterData {
  full_name: string
  email: string
  phone: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authPopupOpen, setAuthPopupOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token')
      const userData = localStorage.getItem('user_data')
      
      if (token && userData) {
        try {
          // Verify token with backend
          const response = await apiClient.get('/api/auth/verify-token')
          
          if (response.data.success) {
            setUser(response.data.user)
            // Fetch cart from backend
            const fetchCart = useCartStore.getState().fetchCartFromBackend
            fetchCart()
          } else {
            // Token invalid, clear storage
            clearAuthData()
          }
        } catch (error) {
          console.error('Token verification failed:', error)
          clearAuthData()
        }
      }
      
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const clearAuthData = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    setUser(null)
    useCartStore.getState().clearCart()
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      const response = await apiClient.post('/api/auth/login', {
        email,
        password
      })
      
      const { access_token, refresh_token, user: userData } = response.data
      
      // Store tokens and user data
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('user_data', JSON.stringify(userData))
      
      setUser(userData)
      setAuthPopupOpen(false)
      
      // Fetch cart from backend
      const fetchCart = useCartStore.getState().fetchCartFromBackend
      fetchCart()
      
      toast.success('Đăng nhập thành công!')
      return { success: true, message: 'Đăng nhập thành công!' }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại'
      toast.error(message)
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      
      const response = await apiClient.post('/api/auth/register', userData)
      
      if (response.data.success) {
        // Auto login after successful registration
        const loginResult = await login(userData.email, userData.password)
        return { success: true, message: response.data.message }
      }
      
      return { success: false, message: response.data.message }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng ký thất bại'
      toast.error(message)
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    clearAuthData()
    setAuthPopupOpen(false)
    toast.success('Đăng xuất thành công!')
  }

  const openAuthPopup = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setAuthPopupOpen(true)
  }

  const closeAuthPopup = () => {
    setAuthPopupOpen(false)
  }

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    register,
    logout,
    openAuthPopup,
    closeAuthPopup,
    authPopupOpen,
    authMode
  }

  return (
    <AuthContext.Provider value={value}>
      {(isLoading && user === null) ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 