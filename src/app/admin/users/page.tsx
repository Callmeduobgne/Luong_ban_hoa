'use client'

import { AdminLayout } from '@/components/admin/admin-layout'
import { UsersList } from '@/components/admin/users-list'
import { Plus, Search, Filter, Download } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function UsersPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalActive: 0,
    totalToday: 0,
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Callback nhận số liệu từ UsersList
  const handleStatsChange = (newStats: typeof stats) => {
    setStats(newStats)
  }

  if (!isMounted) {
    // Chỉ render một khối loading hoặc rỗng khi SSR
    return (
      <AdminLayout title="Quản lý Users">
        <div className="flex items-center justify-center min-h-[300px] text-gray-500 text-lg">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Quản lý Users">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Danh sách Users</h2>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý tài khoản khách hàng và admin
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </button>
            
            <Link
              href="/admin/users/new"
              className="flex items-center px-4 py-2 text-sm text-white bg-orange-600 rounded-lg hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm User
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            {/* Role Filter */}
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            
            {/* Status Filter */}
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Vô hiệu hóa</option>
            </select>
            
            {/* Filter Button */}
            <button className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg">👥</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Admin</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAdmins}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-lg">👑</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoạt động</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalActive}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">✅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalToday}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-lg">🆕</span>
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <UsersList onStatsChange={handleStatsChange} />
      </div>
    </AdminLayout>
  )
} 