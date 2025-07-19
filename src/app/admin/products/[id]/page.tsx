"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [form, setForm] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    images: [""],
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'bo-hoa', label: 'Bó Hoa' },
    { value: 'hop-hoa', label: 'Hộp Hoa' },
    { value: 'hoa-trang-tri', label: 'Hoa Trang Trí' }
  ];

  // Lấy dữ liệu sản phẩm hiện tại
  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        const axios = (await import("axios")).default;
        const res = await axios.get(`${API_URL}/api/products/${productId}`);
        if (res.data.success) {
          setForm(res.data.data);
        }
      } catch {
        alert("Không tìm thấy sản phẩm");
        router.push("/admin/products");
      }
    })();
    // eslint-disable-next-line
  }, [productId]);

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
      await axios.put(`${API_URL}/api/admin/products/${productId}`, form);
      router.push("/admin/products");
    } catch {
      alert("Cập nhật sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Sửa sản phẩm</h1>
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
        <div className="block mb-1 font-medium">Hình ảnh (URL)</div>
        <Input name="image" value={form.images?.[0] || ""} onChange={handleImageChange} placeholder="https://..." />
        <img
          src={form.images?.[0] || "/images/placeholder.png"}
          alt={form.name}
          className="w-full h-48 object-cover rounded-lg mb-2 mt-2"
        />
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Cập nhật"}
          </Button>
        </div>
      </form>
    </div>
  );
} 