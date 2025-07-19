'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { User, LogIn, UserPlus, Settings, LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { AuthPopup } from '@/components/auth/auth-popup'
import { AccountInfoPopup } from '@/components/auth/account-info-popup'
import { MyOrdersPopup } from '@/components/auth/my-orders-popup'

export function UserMenu() {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => { setIsMounted(true) }, [])
  const { user, isLoggedIn, isLoading, logout, openAuthPopup } = useAuth()
  const [showAccountInfo, setShowAccountInfo] = useState(false)
  const [showMyOrders, setShowMyOrders] = useState(false)

  if (!isMounted) return null;

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
        <span className="text-sm text-gray-600">Đang tải...</span>
      </div>
    )
  }

  // User not logged in
  if (!isLoggedIn) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => openAuthPopup('login')}
          className="flex items-center space-x-1 text-sm text-[#b8003c] font-bold hover:text-[#ff8fa3] transition-colors"
        >
          <LogIn className="h-4 w-4" />
          <span>Đăng nhập</span>
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => openAuthPopup('register')}
          className="flex items-center space-x-1 text-sm text-[#b8003c] font-bold hover:text-[#ff8fa3] transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          <span>Đăng ký</span>
        </button>
        <AuthPopup />
      </div>
    )
  }

  // User logged in
  return (
    <>
      <div className="relative group">
        <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
          <User className="h-5 w-5" />
          <div className="text-left">
            <div className="text-sm font-medium">
              {user?.full_name?.split(' ').slice(-1)[0] || 'User'}
            </div>
            <div className="text-xs text-gray-500">
              {user?.role === 'admin' ? '👑 Admin' : '👤 Khách hàng'}
            </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        <div className="absolute top-full right-0 w-64 bg-white shadow-lg rounded-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="font-bold text-[#b8003c]">{user?.full_name}</div>
            <div className="text-sm text-[#b8003c]">{user?.email}</div>
            <div className="text-xs text-[#ff8fa3] mt-1">
              {user?.role === 'admin' ? '🔑 Quản trị viên' : '🌸 Khách hàng thân thiết'}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => setShowAccountInfo(true)}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-[#b8003c] font-bold hover:text-[#ff8fa3] hover:bg-[#ffebf1] transition-colors"
            >
              <User className="h-4 w-4" />
              <span>Thông tin tài khoản</span>
            </button>
            <button
              onClick={() => setShowMyOrders(true)}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-[#b8003c] font-bold hover:text-[#ff8fa3] hover:bg-[#ffebf1] transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Đơn hàng của tôi</span>
            </button>
            {/* Admin Panel Link */}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center space-x-2 px-4 py-2 text-sm text-[#b8003c] font-bold hover:text-[#ff8fa3] hover:bg-[#ffebf1] transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>👑 Quản trị hệ thống</span>
              </Link>
            )}
            <hr className="my-1" />
            <button
              onClick={logout}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-[#b8003c] font-bold hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
          {/* Quick Stats */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <div className="text-xs text-[#ff8fa3]">
              Đăng nhập lần thứ: {user?.login_count || 1} 
            </div>
            {user?.last_login && (
              <div className="text-xs text-[#ff8fa3]">
                Lần cuối: {new Date(user.last_login).toLocaleDateString('vi-VN')}
              </div>
            )}
          </div>
        </div>
      </div>
      <AccountInfoPopup isOpen={showAccountInfo} onClose={() => setShowAccountInfo(false)} />
      <MyOrdersPopup isOpen={showMyOrders} onClose={() => setShowMyOrders(false)} />
    </>
  )
} 