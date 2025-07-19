'use client'

import { useState } from 'react'
import { User, LogOut, Settings, ShoppingBag } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/auth-context'
import { AccountInfoPopup } from '@/features/auth/components/account-info-popup'
import { MyOrdersPopup } from '@/features/auth/components/my-orders-popup'

export function UserMenu() {
  const { user, logout, authPopupOpen } = useAuth()
  const [showAccountInfo, setShowAccountInfo] = useState(false)
  const [showMyOrders, setShowMyOrders] = useState(false)

  if (!user) {
    return null
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowAccountInfo(true)}
          className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors"
        >
          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-pink-600" />
          </div>
          <span className="hidden md:block text-sm font-medium">
            {user.full_name}
          </span>
        </button>

        {showAccountInfo && (
          <AccountInfoPopup
            isOpen={showAccountInfo}
            onClose={() => setShowAccountInfo(false)}
            onShowOrders={() => {
              setShowAccountInfo(false)
              setShowMyOrders(true)
            }}
          />
        )}

        {showMyOrders && (
          <MyOrdersPopup
            isOpen={showMyOrders}
            onClose={() => setShowMyOrders(false)}
          />
        )}
      </div>
    </>
  )
} 