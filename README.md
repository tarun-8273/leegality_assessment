# ShopZone — Leegality Frontend Engineer Assessment

A product listing & detail page application built with React, React Router, and Tailwind CSS, consuming the [DummyJSON Products API](https://dummyjson.com/docs/products).

---

## Setup Instructions

**Prerequisites:** Node.js ≥ 18

```bash
npm install
npm run dev      # starts dev server at http://localhost:5173
npm run build    # production build
npm run preview  # preview production build
```

---

## Architecture Decisions

**State management via Context + URL**  
Filter state (category, brand, price, search query, current page) lives in `FilterContext`, backed by `useSearchParams`. Filters are reflected in the URL as query params — they survive a hard refresh, are shareable via link, and are naturally restored when navigating back from the detail page.

**API vs. client-side filtering**  
- **Category & search** use dedicated API endpoints (`/products/category/{slug}`, `/products/search`) so the server handles pagination correctly for these high-cardinality filters.  
- **Brand & price** are applied client-side on top of the current API page, since the API doesn't expose these as filter params. Brands are extracted from whatever products are currently in view.

**Pagination**  
Uses `limit` / `skip` query params (API-based). Page resets to 1 whenever any filter changes to avoid showing an empty page.

**Debounced search**  
Search triggers on input change with a 400ms debounce via a custom `useDebounce` hook — no form submit required.

**Next-page prefetch**  
After each page loads, the next page is fetched in the background. When the user navigates forward, the browser serves the cached response with near-zero latency.

**Accessibility**  
Filter controls have `aria-label` and `aria-labelledby`. The product count updates via `aria-live="polite"`. Pagination uses `aria-current="page"` and `aria-label` on each button. Product cards are keyboard-navigable (`role="button"`, `tabIndex`, `Enter`/`Space` handlers).

**Component structure**
```
src/
  api/products.js
  context/FilterContext.jsx
  hooks/useDebounce.js
  components/
    Navbar.jsx
    FilterSidebar.jsx
    ProductCard.jsx
    StarRating.jsx
    Pagination.jsx
  pages/
    ProductListingPage.jsx
    ProductDetailPage.jsx
```

---

## Assumptions

- DummyJSON's `/products/category/{slug}` returns all products for a given category (no server-side brand/price filter), so brand + price are filtered client-side.
- The `categories` endpoint returns objects with `slug` and `name` fields (v2 response shape).
- 12 products per page is a reasonable default for the grid layout.
- "Back" uses `navigate(-1)` (browser history) rather than a hard redirect, so browser history is preserved naturally.

