export default function StarRating({ rating, showValue = true, size = 'sm' }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.3
  const starSize = size === 'sm' ? 'text-sm' : 'text-base'

  return (
    <span className="flex items-center gap-1">
      <span className={`${starSize} text-yellow-400`}>
        {Array.from({ length: 5 }, (_, i) => {
          if (i < full) return '★'
          if (i === full && half) return '⭐'.slice(0, 1) + '½'.slice(0, 0) || '★'
          return '☆'
        }).map((s, i) => (
          <span key={i} className={i < full ? 'text-yellow-400' : i === full && half ? 'text-yellow-300' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </span>
      {showValue && (
        <span className="text-xs text-gray-500">({rating.toFixed(1)})</span>
      )}
    </span>
  )
}
