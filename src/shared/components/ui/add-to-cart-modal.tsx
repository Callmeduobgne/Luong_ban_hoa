'use client';

import React, { useState } from 'react';
import { X, Heart, Plus, Minus, Truck, Shield, RotateCcw } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useCartStore } from '@/store/cart-store'
import type { Product } from '../home/featured-products-section'

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function AddToCartModal({ isOpen, onClose, product }: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' VND';
  };

  const totalPrice = product.price * quantity;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addItem({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        flowerType: product.flowerType,
        originalPrice: product.originalPrice,
        discount: product.discount,
        rating: product.rating,
        reviewCount: product.reviewCount,
        isNew: product.isNew,
        isBestSeller: product.isBestSeller,
      }, quantity);
      
      alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
      onClose();
    } catch (error) {
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng');
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <Dialog.Title className="text-2xl font-bold text-gray-800">
                    Chi tiết sản phẩm
                  </Dialog.Title>
                  <Dialog.Description>
                    Thêm sản phẩm vào giỏ hàng, chọn số lượng và xác nhận.
                  </Dialog.Description>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={product.image || '/images/placeholder.png'}
                        alt={product.name}
                        className="w-full h-80 object-cover rounded-xl"
                        sizes="(max-width: 768px) 100vw, 320px"
                      />
                      <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
                      >
                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">{product.category}</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{product.name}</h3>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${i < (product.rating ?? 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({product.reviewCount ?? 0} đánh giá)</span>
                      </div>

                      {/* Price */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-rose-600">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-lg text-gray-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Số lượng:</label>
                        <div className="flex items-center gap-3" style={{ background: '#fffbe6', padding: 8 }}>
                          <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            style={{ background: '#ffe4e6', color: '#d7263d', fontWeight: 'bold', fontSize: 24, width: 40, height: 40, borderRadius: 8, border: '1px solid #d7263d' }}
                          >
                            -
                          </button>
                          <span style={{ color: '#d7263d', fontSize: 24, background: '#fff', minWidth: 60, textAlign: 'center', display: 'inline-block', border: '1px solid #d7263d', borderRadius: 8, padding: '8px 0' }}>
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= 99}
                            style={{ background: '#ffe4e6', color: '#d7263d', fontWeight: 'bold', fontSize: 24, width: 40, height: 40, borderRadius: 8, border: '1px solid #d7263d' }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total Price */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-medium text-gray-700">Tổng cộng:</span>
                          <span className="text-2xl font-bold text-rose-600">
                            {formatPrice(totalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3 pt-2">
                        <button
                          onClick={handleAddToCart}
                          disabled={isAdding}
                          className="w-full bg-rose-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                          {isAdding ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Đang thêm...
                            </>
                          ) : (
                            'Thêm vào giỏ hàng'
                          )}
                        </button>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={onClose}
                            className="py-2 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                          >
                            Tiếp tục mua sắm
                          </button>
                          <button
                            onClick={() => window.location.href = `/products/${product.id}`}
                            className="py-2 px-4 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900 transition-colors"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Information */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Truck className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-800 text-sm">Giao hàng nhanh</p>
                          <p className="text-xs text-gray-600">Trong 2-4 giờ</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Shield className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-800 text-sm">Chất lượng đảm bảo</p>
                          <p className="text-xs text-gray-600">Hoa tươi 100%</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <RotateCcw className="w-6 h-6 text-purple-600" />
                        <div>
                          <p className="font-medium text-gray-800 text-sm">Đổi trả dễ dàng</p>
                          <p className="text-xs text-gray-600">Trong 24 giờ</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 