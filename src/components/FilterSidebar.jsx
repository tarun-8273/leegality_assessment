import { useState } from 'react'
import { useFilters } from '../context/FilterContext'

export default function FilterSidebar({ categories, brands }) {
  const {
    selectedCategory, setSelectedCategory,
    selectedBrands, setSelectedBrands,
    priceRange, setPriceRange,
    setSearchQuery,
    setCurrentPage,
    resetFilters,
  } = useFilters()

  const [localMin, setLocalMin] = useState(priceRange.min)
  const [localMax, setLocalMax] = useState(priceRange.max)

  function handleCategoryChange(slug) {
    setSelectedCategory(prev => prev === slug ? '' : slug)
    setSearchQuery('')
    setCurrentPage(1)
  }

  function handleBrandChange(brand) {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
    setCurrentPage(1)
  }

  function applyPrice() {
    setPriceRange({ min: localMin, max: localMax })
    setCurrentPage(1)
  }

  function handleReset() {
    setLocalMin('')
    setLocalMax('')
    resetFilters()
  }

  const hasActiveFilters = selectedCategory || selectedBrands.length > 0 || priceRange.min || priceRange.max

  return (
    <aside className="w-60 shrink-0" aria-label="Product filters">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sticky top-[4.5rem]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              aria-label="Clear all filters"
              className="text-xs text-blue-600 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <section className="mb-5" aria-labelledby="category-heading">
          <h3 id="category-heading" className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Categories</h3>
          <ul className="space-y-1 max-h-52 overflow-y-auto pr-1" role="list">
            {categories.map(cat => (
              <li key={cat.slug}>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategory === cat.slug}
                    onChange={() => handleCategoryChange(cat.slug)}
                    aria-label={cat.name}
                    className="w-3.5 h-3.5 rounded accent-blue-600"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors capitalize">
                    {cat.name}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-5" aria-labelledby="price-heading">
          <h3 id="price-heading" className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price Range</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Min"
              value={localMin}
              onChange={e => setLocalMin(e.target.value)}
              aria-label="Minimum price"
              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              min={0}
            />
            <input
              type="number"
              placeholder="Max"
              value={localMax}
              onChange={e => setLocalMax(e.target.value)}
              aria-label="Maximum price"
              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              min={0}
            />
          </div>
          <button
            onClick={applyPrice}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg py-1.5 font-medium transition-colors"
          >
            Apply
          </button>
        </section>

        {brands.length > 0 && (
          <section aria-labelledby="brand-heading">
            <h3 id="brand-heading" className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Brands</h3>
            <ul className="space-y-1 max-h-48 overflow-y-auto pr-1" role="list">
              {brands.map(brand => (
                <li key={brand}>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      aria-label={brand}
                      className="w-3.5 h-3.5 rounded accent-blue-600"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                      {brand}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </aside>
  )
}
