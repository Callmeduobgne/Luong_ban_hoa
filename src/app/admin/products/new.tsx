"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

export default function NewProductPage() {
  const [form, setForm] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    images: [""],
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const categories = [
    { value: 'bo-hoa', label: 'Bó Hoa' },
    { value: 'hop-hoa', label: 'Hộp Hoa' },
    { value: 'hoa-trang-tri', label: 'Hoa Trang Trí' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "price" ? Number(value) : value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, images: [e.target.value] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const axios = (await import("axios")).default;
      const token = localStorage.getItem('access_token');
      await axios.post(`${API_URL}/api/admin/products`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push("/admin/products");
    } catch (err) {
      alert("Tạo sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Thêm sản phẩm mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Tên sản phẩm</label>
          <Input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Mô tả</label>
          <Textarea name="description" value={form.description} onChange={handleChange} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Giá</label>
          <Input name="price" type="number" value={form.price} onChange={handleChange} required min={0} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Danh mục</label>
          <select 
            name="category" 
            value={form.category} 
            onChange={handleChange} 
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Chọn danh mục</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Hình ảnh (URL)</label>
          <Input name="image" value={form.images?.[0] || ""} onChange={handleImageChange} placeholder="https://..." />
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Thêm mới"}
          </Button>
        </div>
      </form>
    </div>
  );
} 