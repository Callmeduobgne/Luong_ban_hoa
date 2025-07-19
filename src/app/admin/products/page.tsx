"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductResponse } from "@/types/product";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Plus, Search, Edit, Trash2, AlertCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("bo-hoa");
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [showDialog, setShowDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Product>>({ name: '', description: '', price: 0, category: '', images: [''] });
  const [addLoading, setAddLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const categories = [
    { 
      value: 'bo-hoa', 
      label: 'Bó Hoa',
      icon: '💐',
      description: 'Bó hoa cầm tay, tặng người yêu thương',
      color: 'from-rose-400 to-pink-500'
    },
    { 
      value: 'hop-hoa', 
      label: 'Hộp Hoa',
      icon: '📦',
      description: 'Hộp hoa cao cấp, sang trọng bền đẹp',
      color: 'from-purple-400 to-pink-500'
    },
    { 
      value: 'hoa-trang-tri', 
      label: 'Hoa Trang Trí',
      icon: '🌼',
      description: 'Hoa trang trí sự kiện, không gian',
      color: 'from-emerald-400 to-teal-500'
    }
  ];

  // Check authentication on mount
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

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const axios = (await import("axios")).default;
      console.log('Fetching products from:', `${API_URL}/api/products`);
      const res = await axios.get<ProductResponse>(`${API_URL}/api/products`, {
        params: { search },
      });
      console.log('Products API response:', res.data);
      
      if (res.data.success && res.data.data && res.data.data.products) {
      setProducts(res.data.data.products);
        console.log('Products loaded:', res.data.data.products.length);
      } else {
        console.error('Invalid API response structure:', res.data);
        setProducts([]);
        setError("Định dạng dữ liệu API không hợp lệ");
      }
    } catch (e: any) {
      console.error('Error fetching products:', e);
      setProducts([]);
      setError(`Lỗi khi tải sản phẩm: ${e.response?.data?.message || e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
    fetchProducts();
    }
  }, [search, isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      const axios = (await import("axios")).default;
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_URL}/api/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProducts();
    } catch (e: any) {
      console.error("Xóa sản phẩm thất bại:", e);
      alert(`Xóa thất bại: ${e.response?.data?.message || e.message}`);
    }
  };

  const handleEdit = (product: Product) => {
    setEditId(product.id);
    setEditForm({ ...product });
    setShowDialog(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: name === "price" ? Number(value) : value }));
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm(prev => ({ ...prev, images: [e.target.value] }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    try {
      const axios = (await import("axios")).default;
      const token = localStorage.getItem('access_token');
      await axios.put(`${API_URL}/api/admin/products/${editId}`, editForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditId(null);
      setShowDialog(false);
      fetchProducts();
    } catch (e: any) {
      console.error("Cập nhật sản phẩm thất bại:", e);
      alert(`Cập nhật thất bại: ${e.response?.data?.message || e.message}`);
    }
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: name === "price" ? Number(value) : value }));
  };

  const handleAddImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm(prev => ({ ...prev, images: [e.target.value] }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const axios = (await import("axios")).default;
      const token = localStorage.getItem('access_token');
      console.log('Add product token:', token);
      console.log('Add product form:', addForm);
      const response = await axios.post(`${API_URL}/api/admin/products`, addForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Add product response:', response.data);
      setShowAddDialog(false);
      setAddForm({ name: '', description: '', price: 0, category: '', images: [''] });
      fetchProducts();
    } catch (error: any) {
      console.error("Tạo sản phẩm thất bại:", error);
      alert(`Tạo sản phẩm thất bại: ${error.response?.data?.message || error.message}`);
    } finally {
      setAddLoading(false);
    }
  };

  const openAddDialog = (category: string) => {
    setAddForm({ name: '', description: '', price: 0, category, images: [''] });
    setShowAddDialog(true);
  };

  const getFilteredProducts = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue);
  };

  // If not authenticated, show login message
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

  const renderProductGrid = (categoryProducts: Product[], category: string) => {
    const categoryInfo = getCategoryInfo(category);
    
    console.log(`Rendering ${category}:`, categoryProducts.length, 'products');
    
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="border rounded-lg p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Category Header */}
        <div className={`bg-gradient-to-r ${categoryInfo?.color} rounded-lg p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{categoryInfo?.icon}</div>
              <div>
                <h2 className="text-2xl font-bold">{categoryInfo?.label}</h2>
                <p className="opacity-90">{categoryInfo?.description}</p>
                <p className="text-sm opacity-75 mt-1">
                  {categoryProducts.length} sản phẩm
                </p>
              </div>
            </div>
            <Button 
              onClick={() => openAddDialog(category)}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {categoryProducts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {loading ? "Đang tải sản phẩm..." : "Chưa có sản phẩm nào"}
            </h3>
            <p className="text-gray-500 mb-4">
              {loading 
                ? "Vui lòng đợi..." 
                : `Thêm sản phẩm đầu tiên cho danh mục ${categoryInfo?.label}`
              }
            </p>
            {!loading && (
              <Button onClick={() => openAddDialog(category)}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm sản phẩm
              </Button>
            )}
            {/* Debug info */}
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-left">
              <p>Debug: Total products loaded: {products.length}</p>
              <p>Category filter: {category}</p>
              <p>Products for this category: {categoryProducts.length}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryProducts.map(product => (
              <div key={product.id} className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <img
                src={product.images?.[0] || "/images/placeholder.png"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2 text-sm line-clamp-2">{product.description}</p>
              <p className="text-lg font-bold text-primary mb-4">
                {product.price.toLocaleString()} đ
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                    size="sm"
                  onClick={() => handleEdit(product)}
                    className="flex-1"
                >
                    <Edit className="w-4 h-4 mr-1" />
                  Sửa
                </Button>
                <Button
                  variant="destructive"
                    size="sm"
                  onClick={() => handleDelete(product.id)}
                    className="flex-1"
                >
                    <Trash2 className="w-4 h-4 mr-1" />
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-gray-600 mt-1">
            Quản lý sản phẩm theo từng danh mục ({products.length} sản phẩm)
          </p>
          {error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">⚠️ {error}</p>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button 
            onClick={fetchProducts} 
            variant="outline"
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Làm mới"}
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {categories.map(category => (
            <TabsTrigger 
              key={category.value} 
              value={category.value}
              className="flex items-center space-x-2"
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs ml-2">
                {getFilteredProducts(category.value).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.value} value={category.value}>
            {renderProductGrid(getFilteredProducts(category.value), category.value)}
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-black">Sửa sản phẩm</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 text-black">
            <img
              src={editForm.images?.[0] || "/images/placeholder.png"}
              alt={editForm.name}
              className="w-full h-48 object-cover rounded-lg mb-2"
            />
            <Input name="name" value={editForm.name || ""} onChange={handleEditChange} required className="text-black" placeholder="Tên sản phẩm" />
            <Textarea name="description" value={editForm.description || ""} onChange={handleEditChange} className="text-black" placeholder="Mô tả" />
            <Input name="price" type="number" value={editForm.price || 0} onChange={handleEditChange} required min={0} className="text-black" placeholder="Giá" />
            <select name="category" value={editForm.category || ''} onChange={handleEditChange} className="w-full p-2 border border-gray-300 rounded text-black" required>
              <option value="">Chọn danh mục</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
            <Input name="image" value={editForm.images?.[0] || ""} onChange={handleEditImageChange} placeholder="URL hình ảnh" className="text-black" />
            <div className="flex gap-2 mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Hủy
                </Button>
              </DialogClose>
              <Button type="submit">
                Lưu
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-black">Thêm sản phẩm mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 text-black">
            <Input name="name" value={addForm.name || ""} onChange={handleAddChange} required className="text-black" placeholder="Tên sản phẩm" />
            <Textarea name="description" value={addForm.description || ""} onChange={handleAddChange} className="text-black" placeholder="Mô tả" />
            <Input name="price" type="number" value={addForm.price || 0} onChange={handleAddChange} required min={0} className="text-black" placeholder="Giá" />
            <select name="category" value={addForm.category || ''} onChange={handleAddChange} className="w-full p-2 border border-gray-300 rounded text-black" required>
              <option value="">Chọn danh mục</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
            <Input name="image" value={addForm.images?.[0] || ""} onChange={handleAddImageChange} placeholder="URL hình ảnh" className="text-black" />
            <div className="flex gap-2 mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} disabled={addLoading}>
                  Hủy
                </Button>
              </DialogClose>
              <Button type="submit" disabled={addLoading}>
                {addLoading ? "Đang lưu..." : "Thêm mới"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 