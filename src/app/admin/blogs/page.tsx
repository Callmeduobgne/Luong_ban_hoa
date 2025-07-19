"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  AlertCircle,
  Calendar,
  User
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  status: 'draft' | 'published';
  tags: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

interface BlogResponse {
  success: boolean;
  data: {
    blogs: Blog[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  };
}

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Blog>>({});
  const [showDialog, setShowDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Blog>>({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    status: 'published',
    tags: [],
    is_featured: false
  });
  const [addLoading, setAddLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (!token || !userData) {
      setError("Vui lòng đăng nhập với quyền admin");
      setIsAuthenticated(false);
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== 'admin') {
        setError("Cần quyền admin để truy cập trang này");
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
    } catch {
      setError("Dữ liệu user không hợp lệ");
      setIsAuthenticated(false);
    }
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    setError("");
    try {
      const axios = (await import("axios")).default;
      const token = localStorage.getItem('access_token');
      const res = await axios.get<BlogResponse>(`${API_URL}/api/admin/blogs`, {
        params: { search, status: statusFilter },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success && res.data.data && res.data.data.blogs) {
        setBlogs(res.data.data.blogs);
      } else {
        setBlogs([]);
        setError("Định dạng dữ liệu API không hợp lệ");
      }
    } catch (e: any) {
      console.error('Error fetching blogs:', e);
      setBlogs([]);
      setError(`Lỗi khi tải blog: ${e.response?.data?.message || e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBlogs();
    }
  }, [search, statusFilter, isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa blog này?")) return;
    try {
      const axios = (await import("axios")).default;
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_URL}/api/admin/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
    } catch (e: any) {
      console.error("Xóa blog thất bại:", e);
      alert(`Xóa thất bại: ${e.response?.data?.message || e.message}`);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditId(blog.id);
    setEditForm({ ...blog, tags: blog.tags || [] });
    setShowDialog(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    try {
      const axios = (await import("axios")).default;
      const token = localStorage.getItem('access_token');
      await axios.put(`${API_URL}/api/admin/blogs/${editId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditId(null);
      setShowDialog(false);
      fetchBlogs();
    } catch (e: any) {
      console.error("Cập nhật blog thất bại:", e);
      alert(`Cập nhật thất bại: ${e.response?.data?.message || e.message}`);
    }
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setAddForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setAddForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const axios = (await import("axios")).default;
      const token = localStorage.getItem('access_token');
      await axios.post(`${API_URL}/api/admin/blogs`, addForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowAddDialog(false);
      setAddForm({
        title: '',
        content: '',
        excerpt: '',
        image: '',
        status: 'published',
        tags: [],
        is_featured: false
      });
      fetchBlogs();
    } catch (error: any) {
      console.error("Tạo blog thất bại:", error);
      alert(`Tạo blog thất bại: ${error.response?.data?.message || error.message}`);
    } finally {
      setAddLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // If not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-6 bg-white min-h-screen">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Cần đăng nhập Admin</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={() => router.push('/admin')} 
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Đăng nhập Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Quản lý Blog">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Blog</h1>
          <p className="text-gray-600 mt-1">
            Quản lý nội dung blog và bài viết ({blogs.length} bài viết)
          </p>
          {error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">⚠️ {error}</p>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm bài viết
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm blog..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>
          <Button 
            onClick={fetchBlogs} 
            variant="outline"
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Làm mới"}
          </Button>
        </div>
      </div>

      {/* Blogs List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="border rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có bài viết nào
          </h3>
          <p className="text-gray-500 mb-4">
            Tạo bài viết đầu tiên cho blog của bạn
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm bài viết
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{blog.title}</h3>
                    {blog.is_featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      blog.status === 'published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {blog.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {blog.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(blog.created_at)}
                    </div>
                  </div>
                </div>
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-24 h-16 object-cover rounded-lg ml-4"
                  />
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(blog)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Sửa
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(blog.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Xóa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/blog/${blog.id}`, '_blank')}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Xem
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-black">Sửa bài viết</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Tiêu đề</label>
                <Input 
                  name="title" 
                  value={editForm.title || ""} 
                  onChange={handleEditChange} 
                  required 
                  className="text-black" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Tóm tắt</label>
                <Textarea 
                  name="excerpt" 
                  value={editForm.excerpt || ""} 
                  onChange={handleEditChange} 
                  className="text-black h-20"
                  placeholder="Mô tả ngắn về bài viết..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Nội dung</label>
                <Textarea 
                  name="content" 
                  value={editForm.content || ""} 
                  onChange={handleEditChange} 
                  className="text-black h-40"
                  placeholder="Nội dung chi tiết bài viết..."
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Hình ảnh (URL)</label>
                <Input 
                  name="image" 
                  value={editForm.image || ""} 
                  onChange={handleEditChange} 
                  placeholder="https://..." 
                  className="text-black"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Trạng thái</label>
                <select 
                  name="status" 
                  value={editForm.status || 'published'} 
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                >
                  <option value="published">Đã xuất bản</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={editForm.is_featured || false}
                    onChange={handleEditChange}
                  />
                  <span className="text-black">Bài viết nổi bật</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </DialogClose>
              <Button type="submit">
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-black">Thêm bài viết mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Tiêu đề</label>
                <Input 
                  name="title" 
                  value={addForm.title || ""} 
                  onChange={handleAddChange} 
                  required 
                  className="text-black"
                  placeholder="Nhập tiêu đề bài viết..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Tóm tắt</label>
                <Textarea 
                  name="excerpt" 
                  value={addForm.excerpt || ""} 
                  onChange={handleAddChange} 
                  className="text-black h-20"
                  placeholder="Mô tả ngắn về bài viết..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">Nội dung</label>
                <Textarea 
                  name="content" 
                  value={addForm.content || ""} 
                  onChange={handleAddChange} 
                  className="text-black h-40"
                  placeholder="Nội dung chi tiết bài viết..."
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Hình ảnh (URL)</label>
                <Input 
                  name="image" 
                  value={addForm.image || ""} 
                  onChange={handleAddChange} 
                  placeholder="https://..." 
                  className="text-black"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Trạng thái</label>
                <select 
                  name="status" 
                  value={addForm.status || 'published'} 
                  onChange={handleAddChange}
                  className="w-full p-2 border border-gray-300 rounded text-black"
                >
                  <option value="published">Đã xuất bản</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={addForm.is_featured || false}
                    onChange={handleAddChange}
                  />
                  <span className="text-black">Bài viết nổi bật</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={addLoading}>
                  Hủy
                </Button>
              </DialogClose>
              <Button type="submit" disabled={addLoading}>
                {addLoading ? "Đang lưu..." : "Thêm bài viết"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
} 