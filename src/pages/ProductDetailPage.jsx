import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProductById } from '../api/products'
import StarRating from '../components/StarRating'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchProductById(id)
      .then(data => { setProduct(data); setSelectedImage(0) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse flex gap-8">
          <div className="w-80 h-80 bg-gray-200 rounded-xl shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-2/3" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="space-y-2 mt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-3 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-8 text-center">
        <span className="text-4xl">⚠️</span>
        <p className="mt-3 text-gray-700 font-medium">Failed to load product</p>
        <p className="text-gray-500 text-sm mt-1">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          ← Go Back
        </button>
      </main>
    )
  }

  if (!product) return null

  const images = product.images?.length ? product.images : [product.thumbnail]
  const discount = product.discountPercentage
    ? Math.round(product.price / (1 - product.discountPercentage / 100))
    : null

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 mb-5 transition-colors"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row gap-8">
        <div className="flex flex-col gap-3 md:w-80 shrink-0">
          <div className="aspect-square rounded-xl bg-gray-50 overflow-hidden border border-gray-100">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-contain p-4"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=No+Image' }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === selectedImage ? 'border-blue-500' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt={`view ${i + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            {discount && (
              <span className="text-lg text-gray-400 line-through">${discount}</span>
            )}
            {product.discountPercentage && (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {Math.round(product.discountPercentage)}% OFF
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <StarRating rating={product.rating} size="base" />
            <span className="text-sm text-gray-500">
              {product.reviews?.length
                ? `${product.reviews.length} review${product.reviews.length > 1 ? 's' : ''}`
                : ''}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm mb-4">
            {product.brand && (
              <p><span className="font-medium text-gray-600">Brand:</span> <span className="text-gray-800">{product.brand}</span></p>
            )}
            <p><span className="font-medium text-gray-600">Category:</span> <span className="text-gray-800 capitalize">{product.category}</span></p>
            {product.stock !== undefined && (
              <p>
                <span className="font-medium text-gray-600">Stock:</span>{' '}
                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </p>
            )}
          </div>

          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-800 mb-1.5">Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
              Add to Cart
            </button>
            <button className="px-4 py-2.5 border-2 border-gray-200 hover:border-red-300 hover:text-red-500 rounded-xl transition-colors text-sm">
              ♡ Wishlist
            </button>
          </div>
        </div>
      </div>

      {product.reviews?.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review, i) => (
              <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-800">{review.reviewerName}</span>
                  <StarRating rating={review.rating} />
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600">{review.comment}</p>
                )}
                {review.date && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
