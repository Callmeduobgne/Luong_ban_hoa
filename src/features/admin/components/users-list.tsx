'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldOff,
  Eye,
  Mail,
  Phone,
  Calendar,
  Crown,
  RefreshCw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface User {
  id: string
  full_name: string
  email: string
  phone: string
  role: 'admin' | 'user'
  is_active: boolean
  created_at: string
  last_login?: string
  login_count: number
}

interface UsersListProps {
  onStatsChange?: (stats: {
    totalUsers: number;
    totalAdmins: number;
    totalActive: number;
    totalToday: number;
  }) => void;
}

export function UsersList({ onStatsChange }: UsersListProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [isTabActive, setIsTabActive] = useState(true)

  // Chỉ refresh khi tab đang active
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
    
    // Auto refresh mỗi 5 phút và chỉ khi tab đang active
    const interval = setInterval(() => {
      if (isTabActive) {
      console.log('🔄 Auto refreshing users data...')
      fetchUsers()
      }
    }, 300000) // 5 minutes = 300000ms
    
    return () => clearInterval(interval)
  }, [isTabActive])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get token from localStorage
      const token = localStorage.getItem('access_token')
      if (!token) {
        setError('Vui lòng đăng nhập lại để tiếp tục')
        setMockData()
        return
      }
      
      console.log('📡 Fetching users from API...')
      
      // Call real API
      const response = await fetch('http://localhost:5003/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Map backend data to frontend format
          const mappedUsers: User[] = result.data.users.map((user: any) => ({
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            is_active: user.is_active,
            created_at: user.created_at,
            last_login: user.last_login,
            login_count: user.login_count
          }))
          
          setUsers(mappedUsers)
          setLastRefresh(new Date())
          console.log(`✅ Loaded ${mappedUsers.length} users from API`)
        } else {
          setError(result.message || 'Có lỗi xảy ra khi tải dữ liệu')
          setMockData()
        }
      } else {
        setError('Không thể kết nối đến server. Vui lòng thử lại sau.')
        setMockData()
      }
      
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.')
      setMockData()
    } finally {
      setLoading(false)
    }
  }

  const setMockData = () => {
    // Updated mock data based on real database
    const mockUsers: User[] = [
      {
        id: '1',
        full_name: 'Admin Flower Corner',
        email: 'admin',
        phone: '0987654321',
        role: 'admin',
        is_active: true,
        created_at: '2025-05-28T02:58:03.294000',
        last_login: '2025-05-28T04:26:15.353000',
        login_count: 6
      },
      {
        id: '2',
        full_name: 'Test User',
        email: 'test@example.com',
        phone: '0987654321',
        role: 'user',
        is_active: true,
        created_at: '2025-05-28T04:22:08.030000',
        login_count: 0
      },
      {
        id: '3',
        full_name: 'lương',
        email: 'callmeduongne@gmail.com',
        phone: '0971217764',
        role: 'user',
        is_active: true,
        created_at: '2025-05-28T04:09:44.542000',
        last_login: '2025-05-28T04:09:44.779000',
        login_count: 1
      },
      {
        id: '4',
        full_name: 'Lê Thị Mai',
        email: 'mai.le@gmail.com',
        phone: '0923456789',
        role: 'user',
        is_active: true,
        created_at: '2025-05-28T02:58:03.907000',
        login_count: 0
      },
      {
        id: '5',
        full_name: 'Trần Văn Nam',
        email: 'nam.tran@gmail.com',
        phone: '0912345678',
        role: 'user',
        is_active: true,
        created_at: '2025-05-28T02:58:03.907000',
        login_count: 0
      },
      {
        id: '6',
        full_name: 'Nguyễn Thị Hoa',
        email: 'hoa.nguyen@gmail.com',
        phone: '0901234567',
        role: 'user',
        is_active: true,
        created_at: '2025-05-28T02:58:03.589000',
        last_login: '2025-05-28T03:37:16.691000',
        login_count: 1
      }
    ]
    
    setUsers(mockUsers)
    setLastRefresh(new Date())
    console.log(`📋 Using fallback mock data: ${mockUsers.length} users`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Memoize các hàm xử lý để tránh re-render không cần thiết
  const handleSelectUser = useCallback((userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }, [])

  const handleSelectAll = useCallback(() => {
    setSelectedUsers(
      selectedUsers.length === users.length 
        ? [] 
        : users.map(user => user.id)
    )
  }, [selectedUsers.length, users])

  const handleDeleteUser = useCallback((userId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa user này?')) {
      setUsers(prev => prev.filter(user => user.id !== userId))
    }
  }, [])

  const handleToggleStatus = useCallback((userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, is_active: !user.is_active }
        : user
    ))
  }, [])

  const handleManualRefresh = useCallback(() => {
    console.log('🔄 Manual refresh triggered')
    setLastRefresh(new Date())
    fetchUsers()
  }, [])

  // Memoize các tính toán thống kê
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalAdmins = users.filter(u => u.role === 'admin').length;
    const totalActive = users.filter(u => u.is_active).length;
    const today = new Date().toDateString();
    const totalToday = users.filter(u => {
      if (!u.last_login) return false;
      return new Date(u.last_login).toDateString() === today;
    }).length;

    return { totalUsers, totalAdmins, totalActive, totalToday };
  }, [users]);

  // Gửi số liệu ra ngoài mỗi khi stats thay đổi
  useEffect(() => {
    if (onStatsChange) {
      onStatsChange(stats)
    }
  }, [stats, onStatsChange])

  // Tối ưu animation cho table rows
  const renderTableRows = () => {
    return users.map((user, index) => {
      // Chỉ animate 5 row đầu tiên
      const shouldAnimate = index < 5

  return (
        <motion.tr 
          key={user.id}
          initial={shouldAnimate ? { opacity: 0, y: 20 } : undefined}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
          exit={shouldAnimate ? { opacity: 0, y: -20 } : undefined}
          transition={shouldAnimate ? { delay: index * 0.05 } : undefined}
          className="hover:bg-gray-50 transition-colors"
        >
                {/* Checkbox & User Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 transition-colors mr-4"
                    />
                    <div className="flex items-center">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center"
                >
                        {user.role === 'admin' ? (
                          <Crown className="w-5 h-5 text-orange-600" />
                        ) : (
                          <span className="text-orange-600 font-semibold">
                            {user.full_name.charAt(0)}
                          </span>
                        )}
                </motion.div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Contact Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="w-3 h-3 mr-2 text-gray-400" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-3 h-3 mr-2 text-gray-400" />
                      {user.phone}
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.is_active 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? '✅ Hoạt động' : '❌ Vô hiệu'}
                  </span>
                </td>

                {/* Activity */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-2" />
                      {formatDate(user.created_at)}
                    </div>
                    <div className="text-xs">
                      Đăng nhập: {user.login_count} lần
                      {user.last_login && (
                        <span className="ml-2">
                          (Cuối: {formatDate(user.last_login)})
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
              {renderActionButton(<Eye className="w-4 h-4" />, () => {}, 'Xem chi tiết', 'text-gray-400 hover:text-blue-600')}
              {renderActionButton(<Edit className="w-4 h-4" />, () => {}, 'Chỉnh sửa', 'text-gray-400 hover:text-orange-600')}
              {renderActionButton(user.is_active ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />, () => handleToggleStatus(user.id), user.is_active ? 'Vô hiệu hóa' : 'Kích hoạt', 'p-1 text-gray-400 hover:text-yellow-600')}
              {user.role !== 'admin' && renderActionButton(<Trash2 className="w-4 h-4" />, () => handleDeleteUser(user.id), 'Xóa user', 'p-1 text-gray-400 hover:text-red-600')}
              {renderActionButton(<MoreHorizontal className="w-4 h-4" />, () => {}, 'Thêm hành động', 'p-1 text-gray-400 hover:text-gray-600')}
            </div>
          </td>
        </motion.tr>
      )
    })
  }

  // Tối ưu animation cho buttons
  const renderActionButton = (
    icon: React.ReactNode,
    onClick: () => void,
    title: string,
    className: string
  ) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`p-1 text-gray-400 ${className} transition-colors`}
      title={title}
                    >
      {icon}
      <span className="sr-only">{title}</span>
    </motion.button>
  )

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg border"
      >
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border"
    >
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 bg-red-50 border-b border-red-200 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <p className="text-red-600">{error}</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchUsers}
                className="px-3 py-1 text-sm text-red-600 bg-red-100 rounded hover:bg-red-200"
              >
                Thử lại
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={selectedUsers.length === users.length}
              onChange={handleSelectAll}
              className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 transition-colors"
            />
            <span className="text-sm text-gray-600">
              {selectedUsers.length > 0 
                ? `Đã chọn ${selectedUsers.length} user(s)`
                : `${users.length} users`
              }
            </span>
            <span className="text-xs text-gray-500">
              Cập nhật lần cuối: {lastRefresh.toLocaleTimeString('vi-VN')}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleManualRefresh}
              className="px-3 py-1 text-xs text-orange-600 bg-orange-50 rounded hover:bg-orange-100 flex items-center space-x-1 transition-colors"
              disabled={loading}
                      >
              <RefreshCw className={`w-3 h-3${loading ? ' animate-spin' : ''}`} />
              <span>Làm mới</span>
            </motion.button>
            
            <AnimatePresence>
              {selectedUsers.length > 0 && (
                <>
                  <motion.button 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                    Xuất Excel
                  </motion.button>
                  <motion.button 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                  >
                    Xóa đã chọn
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
                  </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hoạt động
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
              </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {renderTableRows()}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{users.length}</span> trong tổng số <span className="font-medium">{users.length}</span> users
          </div>
          <div className="flex items-center space-x-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors" 
              disabled
            >
              Trước
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 text-sm text-white bg-orange-600 border border-orange-600 rounded transition-colors"
            >
              1
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors" 
              disabled
            >
              Sau
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 