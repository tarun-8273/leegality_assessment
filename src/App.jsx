import { Routes, Route } from 'react-router-dom'
import { FilterProvider } from './context/FilterContext'
import Navbar from './components/Navbar'
import ProductListingPage from './pages/ProductListingPage'
import ProductDetailPage from './pages/ProductDetailPage'

export default function App() {
  return (
    <FilterProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </div>
    </FilterProvider>
  )
}
