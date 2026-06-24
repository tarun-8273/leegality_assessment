import { useState, useEffect, useMemo } from 'react'
import { useFilters } from '../context/FilterContext'
import {
  fetchProducts,
  fetchProductsByCategory,
  fetchCategories,
  searchProducts,
} from '../api/products'
import FilterSidebar from '../components/FilterSidebar'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'

const ITEMS_PER_PAGE = 12

export default function ProductListingPage() {
  const {
    selectedCategory,
    selectedBrands,
    priceRange,
    searchQuery,
    currentPage,
    setCurrentPage,
  } = useFilters()

  const [allProducts, setAllProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCategories()
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const skip = (currentPage - 1) * ITEMS_PER_PAGE
    const limit = ITEMS_PER_PAGE

    const req = searchQuery
      ? searchProducts(searchQuery, { limit, skip })
      : selectedCategory
      ? fetchProductsByCategory(selectedCategory, { limit, skip })
      : fetchProducts({ limit, skip })

    req
      .then(data => {
        if (cancelled) return
        setAllProducts(data.products || [])
        setTotal(data.total || 0)
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [selectedCategory, searchQuery, currentPage])

  const filteredProducts = useMemo(() => {
    let list = allProducts

    if (selectedBrands.length > 0) {
      list = list.filter(p => p.brand && selectedBrands.includes(p.brand))
    }
    if (priceRange.min !== '') {
      list = list.filter(p => p.price >= Number(priceRange.min))
    }
    if (priceRange.max !== '') {
      list = list.filter(p => p.price <= Number(priceRange.max))
    }

    return list
  }, [allProducts, selectedBrands, priceRange])

  const brands = useMemo(() => {
    const set = new Set(allProducts.map(p => p.brand).filter(Boolean))
    return [...set].sort()
  }, [allProducts])

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  useEffect(() => {
    if (!totalPages || currentPage >= totalPages) return
    const nextSkip = currentPage * ITEMS_PER_PAGE
    const req = searchQuery
      ? searchProducts(searchQuery, { limit: ITEMS_PER_PAGE, skip: nextSkip })
      : selectedCategory
      ? fetchProductsByCategory(selectedCategory, { limit: ITEMS_PER_PAGE, skip: nextSkip })
      : fetchProducts({ limit: ITEMS_PER_PAGE, skip: nextSkip })
    req.catch(() => {})
  }, [currentPage, totalPages, selectedCategory, searchQuery])

  function handlePageChange(page) {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      <FilterSidebar categories={categories} brands={brands} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-800">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : selectedCategory
              ? categories.find(c => c.slug === selectedCategory)?.name || selectedCategory
              : 'All Products'}
          </h1>
          <span
            className="text-sm text-gray-500"
            aria-live="polite"
            aria-atomic="true"
          >
            {!loading && `${filteredProducts.length} products`}
          </span>
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-4xl mb-3">⚠️</span>
            <p className="text-gray-700 font-medium mb-1">Something went wrong</p>
            <p className="text-gray-500 text-sm">{error}</p>
            <button
              onClick={() => setCurrentPage(1)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-gray-700 font-medium">No products found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </main>
  )
}
