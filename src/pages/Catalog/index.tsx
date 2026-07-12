import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from '@/components/layout/Sidebar'
import ProductGrid from '@/components/product/ProductGrid'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { setSortBy, selectSortBy, selectFilters } from '@/features/products/productsSlice'
import { openFilterDrawer, closeFilterDrawer, selectFilterDrawerOpen } from '@/features/ui/uiSlice'
import { useGetProductsQuery } from '@/features/products/productsApi'
import type { AppDispatch } from '@/app/store'

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price ↑', value: 'price_asc' },
  { label: 'Price ↓', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
]

export default function CatalogPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { categorySlug } = useParams()
  const [ searchParams ] = useSearchParams()
  const sortBy = useSelector(selectSortBy)
  const filters = useSelector(selectFilters)
  const filterDrawerOpen = useSelector(selectFilterDrawerOpen)
  const searchQuery = searchParams.get('search') || ''

  // Responsive sidebar
  const [ screenW, setScreenW ] = useState(window.innerWidth)
  useEffect(() => {
    const handle = () => setScreenW(window.innerWidth)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])
  useEffect(() => { dispatch(closeFilterDrawer()) }, [ dispatch ])

  const isDesktop = screenW >= 1280

  // Current page state
  const [ page, setPage ] = useState(1)

  // Parse price range string into min/max
  const getPriceRange = () => {
    if (!filters.priceRange) return { minPrice: undefined, maxPrice: undefined }
    const [ min, max ] = filters.priceRange.split('-').map(Number)
    return {
      minPrice: min > 0 ? min : undefined,
      maxPrice: max < 99999 ? max : undefined,
    }
  }

  const { minPrice, maxPrice } = getPriceRange()

  const { data, isLoading, isError, isFetching } = useGetProductsQuery({
    page,
    perPage: 12,
    sortBy,
    categorySlug: categorySlug || undefined,
    search: searchQuery || filters.brands.length > 0
      ? searchQuery || filters.brands.join(' ')
      : undefined,
    minPrice,
    maxPrice,
    rating: filters.rating || undefined,
  })

  // Extract products and pagination from API response
  const products = data?.data?.products || []
  const pagination = data?.data?.pagination || { total: 0, page: 1, pages: 1 }

  // Map backend product shape to ProductCard shape
  const mappedProducts = products.map((p: any) => ({
    id: p._id,
    name: p.name,
    category: p.category?.name || '',
    price: p.discountPrice > 0 ? p.discountPrice : p.price,
    originalPrice: p.price,
    rating: p.ratingsAverage || 0,
    reviews: p.ratingsCount || 0,
    badge: p.isFeatured ? 'NEW' as const
      : p.discountPrice > 0 ? 'SALE' as const
        : p.stock < 10 ? 'HOT' as const
          : null,
    stock: p.stock,
    image: p.images?.[ 0 ]?.url || '📦',
    slug: p.slug,
  }))

  return (
    <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: !isDesktop ? '20px 14px' : '32px 28px' }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: isDesktop ? 22 : 18, marginBottom: 4 }}>
            {categorySlug
              ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
              : searchQuery
                ? `Results for "${searchQuery}"`
                : 'Electronics Catalog'}
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
            {isLoading ? 'Loading…' : `${pagination.total} products`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {!isDesktop && (
            <button
              onClick={() => dispatch(openFilterDrawer())}
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)', borderRadius: 'var(--radius-md)', padding: '8px 14px', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer' }}
            >
              ⚙ FILTERS
            </button>
          )}
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { dispatch(setSortBy(opt.value)); setPage(1) }}
              style={{ background: sortBy === opt.value ? 'var(--accent-dim)' : 'transparent', border: `1px solid ${sortBy === opt.value ? 'var(--accent-border)' : 'var(--border)'}`, color: sortBy === opt.value ? 'var(--accent)' : 'var(--text-muted)', borderRadius: 'var(--radius-md)', padding: '8px 12px', fontFamily: 'var(--font-mono)', fontSize: 10, cursor: 'pointer' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {isDesktop && <Sidebar />}

        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Loading state */}
          {(isLoading || isFetching) && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <Spinner size={40} />
            </div>
          )}

          {/* Error state */}
          {isError && !isLoading && (
            <EmptyState
              icon="⚠️"
              title="Failed to load products"
              message="Could not connect to the server. Please try again."
              action={{ label: 'RETRY', onClick: () => setPage(1) }}
            />
          )}

          {/* Empty state */}
          {!isLoading && !isError && mappedProducts.length === 0 && (
            <EmptyState
              icon="🔍"
              title="No products found"
              message="Try adjusting your filters or search query."
            />
          )}

          {/* Product grid */}
          {!isLoading && !isError && mappedProducts.length > 0 && (
            <ProductGrid products={mappedProducts} />
          )}

          {/* Real Pagination */}
          {!isLoading && pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 40, flexWrap: 'wrap' }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: p === page ? 'var(--accent)' : 'var(--bg-card)', border: `1px solid ${p === page ? 'var(--accent)' : 'var(--border)'}`, color: p === page ? '#08080e' : 'var(--text-sub)', fontFamily: 'var(--font-mono)', fontSize: 12, cursor: 'pointer', fontWeight: p === page ? 700 : 400 }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Drawer */}
      {filterDrawerOpen && !isDesktop && (
        <Sidebar asDrawer onClose={() => dispatch(closeFilterDrawer())} />
      )}
    </div>
  )
}