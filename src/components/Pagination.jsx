export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2
  const left = Math.max(1, currentPage - delta)
  const right = Math.min(totalPages, currentPage + delta)

  for (let i = left; i <= right; i++) pages.push(i)
  if (left > 2) pages.unshift('...')
  if (left > 1) pages.unshift(1)
  if (right < totalPages - 1) pages.push('...')
  if (right < totalPages) pages.push(totalPages)

  const btnBase = 'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors'
  const active = 'bg-blue-600 text-white'
  const inactive = 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
  const disabled = 'opacity-40 cursor-not-allowed'

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 mt-6 pb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`${btnBase} ${inactive} ${currentPage === 1 ? disabled : ''}`}
      >
        ← Prev
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400" aria-hidden="true">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`${btnBase} ${page === currentPage ? active : inactive}`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`${btnBase} ${inactive} ${currentPage === totalPages ? disabled : ''}`}
      >
        Next →
      </button>
    </nav>
  )
}
