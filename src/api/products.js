const BASE = 'https://dummyjson.com'

export async function fetchProducts({ limit = 12, skip = 0 } = {}) {
  const res = await fetch(`${BASE}/products?limit=${limit}&skip=${skip}&select=id,title,price,rating,thumbnail,brand,category`)
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function fetchProductsByCategory(category, { limit = 12, skip = 0 } = {}) {
  const res = await fetch(`${BASE}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}&select=id,title,price,rating,thumbnail,brand,category`)
  if (!res.ok) throw new Error('Failed to fetch products by category')
  return res.json()
}

export async function fetchCategories() {
  const res = await fetch(`${BASE}/products/categories`)
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}

export async function fetchProductById(id) {
  const res = await fetch(`${BASE}/products/${id}`)
  if (!res.ok) throw new Error('Failed to fetch product')
  return res.json()
}

export async function searchProducts(query, { limit = 12, skip = 0 } = {}) {
  const res = await fetch(`${BASE}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}&select=id,title,price,rating,thumbnail,brand,category`)
  if (!res.ok) throw new Error('Failed to search products')
  return res.json()
}
