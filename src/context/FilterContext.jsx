import { createContext, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'

const FilterContext = createContext(null)

export function FilterProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedCategory = searchParams.get('category') || ''
  const selectedBrands = searchParams.getAll('brand')
  const priceRange = {
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  }
  const searchQuery = searchParams.get('q') || ''
  const currentPage = Number(searchParams.get('page')) || 1

  function update(changes) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      Object.entries(changes).forEach(([key, value]) => {
        if (value === null || value === '' || value === undefined) {
          next.delete(key)
        } else if (Array.isArray(value)) {
          next.delete(key)
          value.forEach(v => next.append(key, v))
        } else {
          next.set(key, String(value))
        }
      })
      return next
    })
  }

  function setSelectedCategory(cat) {
    update({ category: cat || null, page: null })
  }

  function setSelectedBrands(brandsOrFn) {
    const current = searchParams.getAll('brand')
    const next = typeof brandsOrFn === 'function' ? brandsOrFn(current) : brandsOrFn
    update({ brand: next.length ? next : null, page: null })
  }

  function setPriceRange({ min, max }) {
    update({ minPrice: min || null, maxPrice: max || null, page: null })
  }

  function setSearchQuery(q) {
    update({ q: q || null, page: null })
  }

  function setCurrentPage(page) {
    update({ page: page === 1 ? null : page })
  }

  function resetFilters() {
    setSearchParams({})
  }

  return (
    <FilterContext.Provider value={{
      selectedCategory, setSelectedCategory,
      selectedBrands, setSelectedBrands,
      priceRange, setPriceRange,
      searchQuery, setSearchQuery,
      currentPage, setCurrentPage,
      resetFilters,
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  return useContext(FilterContext)
}
