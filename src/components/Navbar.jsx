import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFilters } from '../context/FilterContext'
import { useDebounce } from '../hooks/useDebounce'

export default function Navbar() {
  const navigate = useNavigate()
  const { searchQuery, setSearchQuery, setSelectedCategory, setCurrentPage } = useFilters()
  const [inputValue, setInputValue] = useState(searchQuery)
  const debouncedInput = useDebounce(inputValue, 400)

  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    if (debouncedInput === searchQuery) return
    setSelectedCategory('')
    setSearchQuery(debouncedInput)
    setCurrentPage(1)
    navigate('/')
  }, [debouncedInput])

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          aria-label="Go to home"
          className="text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors whitespace-nowrap"
        >
          🛒 ShopZone
        </button>

        <div className="flex-1 max-w-xl">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">🔍</span>
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-gray-700 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-300 text-lg ml-auto">
          <button title="Cart" aria-label="Cart" className="hover:text-white transition-colors">🛒</button>
          <button title="Wishlist" aria-label="Wishlist" className="hover:text-white transition-colors">❤️</button>
          <button title="Account" aria-label="Account" className="hover:text-white transition-colors">👤</button>
        </div>
      </div>
    </header>
  )
}
