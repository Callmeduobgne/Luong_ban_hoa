'use client'

import { useState } from 'react'
import { OrdersList } from '@/components/admin/orders-list'
import { OrdersStats } from '@/components/admin/orders-stats'
import { AdminLayout } from '@/components/admin/admin-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, Download, Plus } from 'lucide-react'

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  return (
    <AdminLayout title="Quản lý đơn hàng">
    <div className="space-y-6">
        {/* Header with search and actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm đơn hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-black placeholder:text-gray-500"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Xuất
            </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo đơn hàng
          </Button>
        </div>

        {/* Stats Cards */}
      <OrdersStats />

        {/* Orders Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
            <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
            <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
            <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <OrdersList status="all" searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="pending">
            <OrdersList status="pending" searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="processing">
            <OrdersList status="processing" searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="completed">
            <OrdersList status="completed" searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="cancelled">
            <OrdersList status="cancelled" searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
    </div>
    </AdminLayout>
  )
}
