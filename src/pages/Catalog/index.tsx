import { useParams, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from '@/components/layout/Sidebar'
import ProductGrid from '@/components/product/ProductGrid'
import { setSortBy, selectSortBy, selectFilters } from '@/features/products/productsSlice'
import { openFilterDrawer, selectFilterDrawerOpen, closeFilterDrawer } from '@/features/ui/uiSlice'
import type { AppDispatch } from '@/app/store'

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price ↑', value: 'price_asc' },
  { label: 'Price ↓', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
]

const MOCK_PRODUCTS = [
  { id: '1', name: 'NVIDIA RTX 5090', category: 'GPU', price: 1999, originalPrice: 2199, rating: 4.9, reviews: 1247, badge: 'HOT' as const, stock: 3, image: '🎮' },
  { id: '2', name: 'MacBook Pro M4 Max', category: 'Laptop', price: 3499, originalPrice: 3699, rating: 4.8, reviews: 892, badge: 'NEW' as const, stock: 12, image: '💻' },
  { id: '3', name: 'Samsung 4K OLED 32"', category: 'Monitor', price: 899, originalPrice: 1099, rating: 4.7, reviews: 563, badge: 'SALE' as const, stock: 7, image: '🖥️' },
  { id: '4', name: 'Intel Core Ultra 9', category: 'CPU', price: 589, originalPrice: 649, rating: 4.6, reviews: 334, badge: null, stock: 15, image: '⚙️' },
  { id: '5', name: 'Corsair DDR5 64GB', category: 'RAM', price: 299, originalPrice: 349, rating: 4.5, reviews: 218, badge: 'DEAL' as const, stock: 22, image: '🔩' },
  { id: '6', name: 'WD Black SN850X 4TB', category: 'NVMe', price: 249, originalPrice: 299, rating: 4.8, reviews: 445, badge: null, stock: 9, image: '💾' },
]

export default function CatalogPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { categorySlug } = useParams()
  const [ searchParams ] = useSearchParams()
  const sortBy = useSelector(selectSortBy)
  const filterDrawerOpen = useSelector(selectFilterDrawerOpen)
  const searchQuery = searchParams.get('search') || ''

  return (
    <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '32px 28px' }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>
            {categorySlug
              ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
              : searchQuery
                ? `Results for "${searchQuery}"`
                : 'Electronics Catalog'}
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
            {MOCK_PRODUCTS.length} products
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => dispatch(openFilterDrawer())} style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)', borderRadius: 'var(--radius-md)', padding: '7px 12px', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer' }}>
            ⚙ FILTERS
          </button>
          {SORT_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => dispatch(setSortBy(opt.value))} style={{ background: sortBy === opt.value ? 'var(--accent-dim)' : 'transparent', border: `1px solid ${sortBy === opt.value ? 'var(--accent-border)' : 'var(--border)'}`, color: sortBy === opt.value ? 'var(--accent)' : 'var(--text-muted)', borderRadius: 'var(--radius-md)', padding: '7px 12px', fontFamily: 'var(--font-mono)', fontSize: 10, cursor: 'pointer' }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <ProductGrid products={MOCK_PRODUCTS} />
          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 40 }}>
            {[ 1, 2, 3, '…', 8 ].map((p, i) => (
              <button key={i} style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: p === 1 ? 'var(--accent)' : 'var(--bg-card)', border: `1px solid ${p === 1 ? 'var(--accent)' : 'var(--border)'}`, color: p === 1 ? '#08080e' : 'var(--text-sub)', fontFamily: 'var(--font-mono)', fontSize: 12, cursor: 'pointer', fontWeight: p === 1 ? 700 : 400 }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
      {filterDrawerOpen && <Sidebar asDrawer onClose={() => dispatch(closeFilterDrawer())} />}
    </div>
  )
}