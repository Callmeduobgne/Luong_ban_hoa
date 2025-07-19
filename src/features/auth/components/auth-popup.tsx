'use client'

import { useState } from 'react'
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export function AuthPopup() {
  const { authPopupOpen, authMode, closeAuthPopup, login, register, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [currentMode, setCurrentMode] = useState<'login' | 'register'>(authMode)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const [registerData, setRegisterData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const resetForms = () => {
    setLoginData({ email: '', password: '' })
    setRegisterData({ full_name: '', email: '', phone: '', password: '', confirmPassword: '' })
    setMessage(null)
    setShowPassword(false)
  }

  const handleClose = () => {
    resetForms()
    closeAuthPopup()
  }

  const handleModeSwitch = (mode: 'login' | 'register') => {
    setCurrentMode(mode)
    setMessage(null)
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!loginData.email || !loginData.password) {
      setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin' })
      return
    }

    const result = await login(loginData.email, loginData.password)
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message })
      setTimeout(() => {
        handleClose()
      }, 1000)
    } else {
      setMessage({ type: 'error', text: result.message })
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // Validation
    if (!registerData.full_name || !registerData.email || !registerData.phone || !registerData.password) {
      setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin' })
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' })
      return
    }

    if (registerData.password.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự' })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(registerData.email)) {
      setMessage({ type: 'error', text: 'Email không hợp lệ' })
      return
    }

    const phoneRegex = /^0[0-9]{9,10}$/
    if (!phoneRegex.test(registerData.phone)) {
      setMessage({ type: 'error', text: 'Số điện thoại không hợp lệ (VD: 0987654321)' })
      return
    }

    const result = await register({
      full_name: registerData.full_name,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password
    })

    if (result.success) {
      setMessage({ type: 'success', text: result.message })
      setTimeout(() => {
        handleClose()
      }, 1000)
    } else {
      setMessage({ type: 'error', text: result.message })
    }
  }

  if (!authPopupOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-2xl shadow-xl w-full max-w-md relative transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="p-6 pb-4">
            <div className="text-center mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 mx-auto mb-4">
                <span className="text-xl font-bold text-white">N7</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentMode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
              </h2>
              <p className="text-gray-600 mt-2">
                {currentMode === 'login' 
                  ? 'Chào mừng bạn quay trở lại!' 
                  : 'Tạo tài khoản để trải nghiệm dịch vụ tốt nhất'
                }
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
              <button
                onClick={() => handleModeSwitch('login')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  currentMode === 'login'
                    ? 'bg-white text-rose-600 shadow-sm font-semibold'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => handleModeSwitch('register')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  currentMode === 'register'
                    ? 'bg-white text-rose-600 shadow-sm font-semibold'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Đăng ký
              </button>
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Login Form */}
            {currentMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Email hoặc Username
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="text"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-gray-900 placeholder-gray-500"
                      placeholder="admin hoặc your@email.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-gray-900 placeholder-gray-500"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-rose-600 text-white py-3 rounded-lg font-medium hover:bg-rose-700 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    'Đăng nhập'
                  )}
                </button>
              </form>
            )}

            {/* Register Form */}
            {currentMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="text"
                      value={registerData.full_name}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-gray-900 placeholder-gray-500"
                      placeholder="Nguyễn Văn A"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-gray-900 placeholder-gray-500"
                      placeholder="your@email.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-gray-900 placeholder-gray-500"
                      placeholder="0987654321"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-gray-900 placeholder-gray-500"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-gray-900 placeholder-gray-500"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-rose-600 text-white py-3 rounded-lg font-medium hover:bg-rose-700 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Đang đăng ký...
                    </>
                  ) : (
                    'Đăng ký tài khoản'
                  )}
                </button>
              </form>
            )}

            {/* Test Accounts Info */}
            <div className="mt-6 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-xs text-emerald-800 font-semibold mb-2">🧪 Tài khoản test:</p>
              <p className="text-xs text-emerald-700 font-medium">👑 Admin: <span className="font-mono">admin</span> / <span className="font-mono">admin</span></p>
              <p className="text-xs text-emerald-700 font-medium">👤 User: <span className="font-mono">hoa.nguyen@gmail.com</span> / <span className="font-mono">123456</span></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 