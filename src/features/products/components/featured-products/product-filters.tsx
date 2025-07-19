'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FilterOption {
  id: string
  label: string
  icon?: string
}

interface ProductFiltersProps {
  selectedOccasion: string
  selectedFlowerType: string
  onOccasionChange: (occasion: string) => void
  onFlowerTypeChange: (flowerType: string) => void
}

const occasionFilters: FilterOption[] = [
  { id: 'all', label: 'Tất cả', icon: '🌸' },
  { id: 'birthday', label: 'Sinh nhật', icon: '🎂' },
  { id: 'wedding', label: 'Cưới hỏi', icon: '💒' },
  { id: 'funeral', label: 'Tang lễ', icon: '🕊️' },
  { id: 'congratulation', label: 'Chúc mừng', icon: '🎉' },
  { id: 'gift', label: 'Quà tặng', icon: '🎁' }
]

const flowerTypeFilters: FilterOption[] = [
  { id: 'all', label: 'Tất cả loại hoa' },
  { id: 'rose', label: 'Hoa hồng' },
  { id: 'carnation', label: 'Hoa cẩm chướng' },
  { id: 'orchid', label: 'Hoa lan' },
  { id: 'lily', label: 'Hoa ly' },
  { id: 'mixed', label: 'Hoa hỗn hợp' }
]

export function ProductFilters({
  selectedOccasion,
  selectedFlowerType,
  onOccasionChange,
  onFlowerTypeChange
}: ProductFiltersProps) {
  const [isFlowerTypeOpen, setIsFlowerTypeOpen] = useState(false)

  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-8">
      {/* Occasion Filter Tabs */}
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Lọc theo dịp:</h3>
        <div className="flex flex-wrap gap-2">
          {occasionFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onOccasionChange(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedOccasion === filter.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.icon && <span>{filter.icon}</span>}
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Flower Type Filter Dropdown */}
      <div className="lg:w-64">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Loại hoa:</h3>
        <div className="relative">
          <button
            onClick={() => setIsFlowerTypeOpen(!isFlowerTypeOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-primary-600 transition-colors"
          >
            {flowerTypeFilters.find(f => f.id === selectedFlowerType)?.label || 'Chọn loại hoa'}
            <ChevronDown className={`h-4 w-4 transition-transform ${isFlowerTypeOpen ? 'rotate-180' : ''}`} />
          </button>

          {isFlowerTypeOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {flowerTypeFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    onFlowerTypeChange(filter.id)
                    setIsFlowerTypeOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    selectedFlowerType === filter.id
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 