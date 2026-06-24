import { useNavigate } from 'react-router-dom'
import StarRating from './StarRating'

export default function ProductCard({ product }) {
  const navigate = useNavigate()

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      navigate(`/product/${product.id}`)
    }
  }

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${product.title}, $${product.price}, rated ${product.rating} out of 5`}
      className="bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-contain p-3"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image' }}
        />
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mt-auto pt-1">
          <span className="text-base font-bold text-gray-900">${product.price}</span>
          <StarRating rating={product.rating} />
        </div>
      </div>
    </div>
  )
}
