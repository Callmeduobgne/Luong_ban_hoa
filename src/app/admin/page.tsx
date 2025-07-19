'use client'

import { AdminLayout } from '@/components/admin/admin-layout'
import { DashboardStats } from '@/components/admin/dashboard-stats'
import { RecentActivity } from '@/components/admin/recent-activity'
import { QuickActions } from '@/components/admin/quick-actions'

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-orange-600 to-rose-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Chào mừng trở lại! 👋</h2>
          <p className="text-orange-100">
            Quản lý shop hoa N07.floral - Luong Ban Hoa tại Thái Nguyên
          </p>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 