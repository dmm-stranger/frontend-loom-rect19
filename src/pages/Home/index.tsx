import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { ROUTES } from '@/constants/routes'
import { clearFilters } from '@/features/products/productsSlice'
import { useGetFeaturedProductsQuery, useGetCategoriesQuery } from '@/features/products/productsApi'
import ProductGrid from '@/components/product/ProductGrid'
import Spinner from '@/components/common/Spinner'
import type { AppDispatch } from '@/app/store'
import CategoryIcon from '@/components/common/CategoryIcon'

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>()

  // Clear filters when returning to home
  useEffect(() => {
    dispatch(clearFilters())
  }, [ dispatch ])

  // Fetch featured products from real API
  const { data: featuredData, isLoading: featuredLoading } = useGetFeaturedProductsQuery({})
  const featuredRaw = featuredData?.data?.products || []

  // Map to ProductCard shape
  const featuredProducts = featuredRaw.map((p: any) => ({
    id: p._id,
    name: p.name,
    category: p.category?.name || '',
    price: p.discountPrice > 0 ? p.discountPrice : p.price,
    originalPrice: p.price,
    rating: p.ratingsAverage || 0,
    reviews: p.ratingsCount || 0,
    badge: p.discountPrice > 0 ? 'SALE' as const : 'NEW' as const,
    stock: p.stock,
    image: p.images?.[ 0 ]?.url || '📦',
    slug: p.slug,
  }))

  // Fetch real categories
  const { data: catData } = useGetCategoriesQuery({})
  const categories = catData?.data?.categories || []

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        maxWidth: 'var(--max-w)', margin: '0 auto',
        padding: '80px 28px', display: 'flex',
        flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: 24,
      }}>
        <div style={{
          fontSize: 10, fontFamily: 'var(--font-mono)',
          color: 'var(--accent)', letterSpacing: '0.2em',
          textTransform: 'uppercase', padding: '4px 14px',
          border: '1px solid var(--accent-border)',
          borderRadius: 100, background: 'var(--accent-dim)',
        }}>
          ⚡ New arrivals — Check out our latest products
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 68px)',
          fontWeight: 800, lineHeight: 1.05, maxWidth: 700,
        }}>
          Next-Gen Tech.<br />
          <span style={{ color: 'var(--accent)' }}>Delivered Fast.</span>
        </h1>

        <p style={{
          fontSize: 17, color: 'var(--text-sub)',
          maxWidth: 460, lineHeight: 1.65,
        }}>
          Premium electronics, cutting-edge components, and the latest gear.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to={ROUTES.CATALOG} style={{
            background: 'var(--accent)', color: '#08080e',
            borderRadius: 'var(--radius-md)', padding: '14px 28px',
            fontFamily: 'var(--font-mono)', fontWeight: 700,
            fontSize: 13, letterSpacing: '0.1em', textDecoration: 'none',
          }}>
            SHOP NOW →
          </Link>
          <Link to="/catalog?filter=deals" style={{
            background: 'transparent', color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '14px 28px',
            fontFamily: 'var(--font-mono)', fontSize: 13,
            letterSpacing: '0.1em', textDecoration: 'none',
          }}>
            VIEW DEALS
          </Link>
        </div>
      </section>

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <section style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 28px 60px' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
            Shop by Category
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 12,
          }}>
            {categories.map((cat: any) => (
              <Link
                key={cat._id}
                to={`/catalog/${cat.slug}`}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px 16px', textAlign: 'center',
                  textDecoration: 'none', color: 'var(--text)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 10,
                  transition: 'border-color 0.2s',
                }}
              >
                <CategoryIcon category={cat} size={32} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Featured Products ── */}
      <section style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 28px 80px' }}>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
          Featured Products
        </h2>

        {featuredLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <Spinner size={36} />
          </div>
        )}

        {!featuredLoading && featuredProducts.length > 0 && (
          <ProductGrid products={featuredProducts} />
        )}

        {!featuredLoading && featuredProducts.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            No featured products yet.
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <Link to={ROUTES.CATALOG} style={{
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent-border)',
            color: 'var(--accent)', borderRadius: 'var(--radius-md)',
            padding: '12px 28px', fontFamily: 'var(--font-mono)',
            fontWeight: 700, fontSize: 12, letterSpacing: '0.1em',
            textDecoration: 'none',
          }}>
            VIEW ALL PRODUCTS →
          </Link>
        </div>
      </section>
    </div>
  )
}