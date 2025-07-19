'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Redirect to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm hoa sinh nhật, hoa cưới..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-4 pr-12 py-2.5 text-sm placeholder:text-gray-500 focus:border-primary-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-primary-600 p-1.5 text-white hover:bg-primary-700 transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
} 