import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useGetProductByIdQuery, useGetProductsQuery } from '@/features/products/productsApi'
import { addItem } from '@/features/cart/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '@/features/wishlist/wishlistSlice'
import { openCartDrawer } from '@/features/ui/uiSlice'
import { formatCurrency, discountPercent } from '@/utils/formatCurrency'
import { selectIsAuth } from '@/features/auth/authSlice'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import ProductGrid from '@/components/product/ProductGrid'
import type { AppDispatch } from '@/app/store'

type TabType = 'description' | 'specs' | 'shipping'

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth)
  const wishlisted = useSelector(selectIsWishlisted(productId || ''))

  const [ activeImage, setActiveImage ] = useState(0)
  const [ activeTab, setActiveTab ] = useState<TabType>('description')
  const [ qty, setQty ] = useState(1)
  const [ addedToCart, setAddedToCart ] = useState(false)

  // Fetch product by slug
  const { data, isLoading, isError } = useGetProductByIdQuery(productId || '')
  const product = data?.data?.product

  // Fetch related products (same category)
  const { data: relatedData } = useGetProductsQuery(
    { categorySlug: product?.category?.slug, perPage: 4 },
    { skip: !product?.category?.slug }
  )
  const relatedRaw = relatedData?.data?.products || []
  const related = relatedRaw
    .filter((p: any) => p._id !== product?._id)
    .slice(0, 4)
    .map((p: any) => ({
      id: p._id,
      name: p.name,
      category: p.category?.name || '',
      price: p.discountPrice > 0 ? p.discountPrice : p.price,
      originalPrice: p.price,
      rating: p.ratingsAverage || 0,
      reviews: p.ratingsCount || 0,
      badge: p.discountPrice > 0 ? 'SALE' as const : null,
      stock: p.stock,
      image: p.images?.[ 0 ]?.url || '📦',
      slug: p.slug,
    }))

  const handleAddToCart = () => {
    if (!product) return
    dispatch(addItem({
      productId: product._id,
      name: product.name,
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      qty,
      image: product.images?.[ 0 ]?.url || '📦',
    }))
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
    dispatch(openCartDrawer())
  }

  // ── Loading ──
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <Spinner size={48} />
      </div>
    )
  }

  // ── Error ──
  if (isError || !product) {
    return (
      <EmptyState
        icon="⚠️"
        title="Product not found"
        message="This product does not exist or was removed."
        action={{ label: '← BACK TO CATALOG', onClick: () => navigate('/catalog') }}
      />
    )
  }

  const salePrice = product.discountPrice > 0 ? product.discountPrice : product.price
  const discount = product.discountPrice > 0 ? discountPercent(product.price, product.discountPrice) : 0
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock < 10

  return (
    <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '24px 28px' }}>

      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11, textDecoration: 'none' }}>Home</Link>
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>›</span>
        <Link to={`/catalog/${product.category?.slug}`} style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11, textDecoration: 'none' }}>{product.category?.name}</Link>
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>›</span>
        <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{product.name}</span>
      </div>

      {/* ── Main Grid: Image + Info ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, marginBottom: 48 }}>

        {/* ── Left: Image Gallery ── */}
        <div>
          {/* Main Image */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            marginBottom: 12, aspectRatio: '4/3',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {product.images?.[ activeImage ]?.url ? (
              <img
                src={product.images[ activeImage ].url}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: 80 }}>📦</span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {product.images.map((img: any, i: number) => (
                <button
                  key={img._id}
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: 64, height: 64, padding: 0, cursor: 'pointer',
                    border: `2px solid ${i === activeImage ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm)', overflow: 'hidden',
                    background: 'var(--bg-card)', flexShrink: 0,
                  }}
                >
                  <img src={img.url} alt={`${product.name} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Product Info ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Brand + Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {product.brand}
            </span>
            {product.isFeatured && (
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', padding: '2px 8px', borderRadius: 4, background: '#00cfff18', color: 'var(--accent)', border: '1px solid var(--accent-border)', fontFamily: 'var(--font-mono)' }}>
                FEATURED
              </span>
            )}
            {discount > 0 && (
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', padding: '2px 8px', borderRadius: 4, background: '#f59e0b18', color: 'var(--gold)', border: '1px solid #f59e0b33', fontFamily: 'var(--font-mono)' }}>
                SALE
              </span>
            )}
          </div>

          {/* Product Name */}
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 'clamp(20px, 3vw, 28px)', lineHeight: 1.2, color: 'var(--text)', margin: 0 }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--gold)', fontSize: 16 }}>
              {'★'.repeat(Math.round(product.ratingsAverage))}{'☆'.repeat(5 - Math.round(product.ratingsAverage))}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
              ({product.ratingsCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-sans)' }}>
              {formatCurrency(salePrice)}
            </span>
            {discount > 0 && (
              <>
                <span style={{ fontSize: 18, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {formatCurrency(product.price)}
                </span>
                <span style={{ fontSize: 13, color: 'var(--success)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  -{discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {isOutOfStock && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--danger)', fontWeight: 700 }}>
                ✕ OUT OF STOCK
              </span>
            )}
            {isLowStock && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gold)', fontWeight: 700 }}>
                ⚠ Only {product.stock} left in stock
              </span>
            )}
            {!isOutOfStock && !isLowStock && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--success)', fontWeight: 700 }}>
                ✓ In Stock ({product.stock} available)
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>QTY</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: 36, height: 36, background: 'var(--bg-card)', border: 'none', color: 'var(--text)', fontSize: 18, cursor: 'pointer' }}
                >−</button>
                <span style={{ width: 40, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text)', background: 'var(--bg-elevated)' }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  style={{ width: 36, height: 36, background: 'var(--bg-card)', border: 'none', color: 'var(--text)', fontSize: 18, cursor: 'pointer' }}
                >+</button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                flex: 1, minWidth: 160,
                background: isOutOfStock ? 'var(--border)' : addedToCart ? 'var(--success)' : 'var(--accent)',
                color: '#08080e', border: 'none',
                borderRadius: 'var(--radius-md)', padding: '14px 0',
                fontFamily: 'var(--font-mono)', fontWeight: 700,
                fontSize: 13, letterSpacing: '0.1em',
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {addedToCart ? '✓ ADDED!' : isOutOfStock ? 'OUT OF STOCK' : '+ ADD TO CART'}
            </button>

            <button
              onClick={() => dispatch(toggleWishlist(product._id))}
              style={{
                width: 50, height: 50, flexShrink: 0,
                background: wishlisted ? '#ff4d6a18' : 'var(--bg-card)',
                border: `1px solid ${wishlisted ? '#ff4d6a44' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                color: wishlisted ? '#ff4d6a' : 'var(--text-muted)',
                fontSize: 20, cursor: 'pointer',
              }}
            >
              {wishlisted ? '❤️' : '♥'}
            </button>
          </div>

          {/* Category */}
          <div style={{ paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
              CATEGORY: {' '}
            </span>
            <Link to={`/catalog/${product.category?.slug}`} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', textDecoration: 'none' }}>
              {product.category?.name}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Tabs: Description | Specs | Shipping ── */}
      <div style={{ marginBottom: 48 }}>
        {/* Tab buttons */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
          {([ 'description', 'specs', 'shipping' ] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab ? 'var(--accent)' : 'transparent'}`,
                color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '12px 20px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                marginBottom: -1,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'description' && (
          <div style={{ maxWidth: 720 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-sub)', lineHeight: 1.8 }}>
              {product.description}
            </p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div style={{ maxWidth: 600 }}>
            {Object.entries(product.specs || {}).map(([ key, val ]) => (
              <div key={key} style={{
                display: 'flex', gap: 16, padding: '12px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', minWidth: 140, flexShrink: 0 }}>
                  {key.toUpperCase()}
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)' }}>
                  {String(val)}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'shipping' && (
          <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On all orders over $50. Delivery in 3-5 business days.' },
              { icon: '↩️', title: '30-Day Returns', desc: 'Not satisfied? Return it within 30 days for a full refund.' },
              { icon: '🔒', title: 'Secure Packaging', desc: 'All items are carefully packed to prevent damage in transit.' },
              { icon: '📦', title: 'Order Tracking', desc: 'Track your order in real time from dispatch to delivery.' },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', gap: 16, padding: 16, background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>{item.title}</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Reviews Section ── */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 20, marginBottom: 24, color: 'var(--text)' }}>
          Customer Reviews
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginLeft: 10, fontWeight: 400 }}>
            ({product.ratingsCount})
          </span>
        </h2>

        {/* Review summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: 20, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 48, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-sans)', lineHeight: 1 }}>
              {product.ratingsAverage.toFixed(1)}
            </p>
            <span style={{ color: 'var(--gold)', fontSize: 18 }}>
              {'★'.repeat(Math.round(product.ratingsAverage))}
            </span>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
              {product.ratingsCount} reviews
            </p>
          </div>
        </div>

        {/* No reviews yet */}
        {product.ratingsCount === 0 && (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            No reviews yet. Be the first to review this product.
          </div>
        )}

        {/* Add review — logged in users only */}
        <div style={{ marginTop: 24, padding: 20, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--text)', marginBottom: 16 }}>
            Write a Review
          </h3>

          {!isAuth ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: 14, marginBottom: 12 }}>
                You must be logged in to leave a review.
              </p>
              <Link to="/auth/login" style={{ background: 'var(--accent)', color: '#08080e', borderRadius: 'var(--radius-md)', padding: '10px 24px', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, textDecoration: 'none', letterSpacing: '0.08em' }}>
                SIGN IN TO REVIEW
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Star rating selector */}
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 8 }}>YOUR RATING</p>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[ 1, 2, 3, 4, 5 ].map(star => (
                    <button key={star} style={{ background: 'transparent', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--gold)' }}>★</button>
                  ))}
                </div>
              </div>
              {/* Review text */}
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 8 }}>YOUR REVIEW</p>
                <textarea
                  placeholder="Share your experience with this product…"
                  rows={4}
                  style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
              <button style={{ alignSelf: 'flex-start', background: 'var(--accent)', color: '#08080e', border: 'none', borderRadius: 'var(--radius-md)', padding: '12px 24px', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', cursor: 'pointer' }}>
                SUBMIT REVIEW
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 20, marginBottom: 24, color: 'var(--text)' }}>
            Related Products
          </h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  )
}