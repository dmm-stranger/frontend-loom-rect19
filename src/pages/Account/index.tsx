import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuth, selectCurrentUser } from '@/features/auth/authSlice'
import { useGetMyOrdersQuery } from '@/features/orders/ordersApi'
import { selectWishlist } from '@/features/wishlist/wishlistSlice'
import { useGetProductsQuery } from '@/features/products/productsApi'
import { formatCurrency } from '@/utils/formatCurrency'
import Spinner from '@/components/common/Spinner'
import { ROUTES } from '@/constants/routes'
import { Link } from 'react-router-dom'

type Section = 'profile' | 'orders' | 'wishlist'

const STATUS_COLORS: Record<string, string> = {
  processing: 'var(--gold)',
  shipped: 'var(--accent)',
  delivered: 'var(--success)',
  cancelled: 'var(--danger)',
  pending: 'var(--text-muted)',
}

export default function AccountPage() {
  const isAuth = useSelector(selectIsAuth)
  const user = useSelector(selectCurrentUser)
  const [ section, setSection ] = useState<Section>('profile')

  // Redirect if not logged in
  if (!isAuth) return <Navigate to={ROUTES.LOGIN} replace />

  return (
    <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '32px 28px' }}>

      {/* Page title */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 24, color: 'var(--text)', marginBottom: 4 }}>
          My Account
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
          {user?.email}
        </p>
      </div>

      {/* Layout: sidebar + content */}
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: 220,
          flexShrink: 0,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 8,
          position: 'sticky',
          top: 'calc(var(--header-h) + 16px)',
          alignSelf: 'flex-start',
        }}>
          {/* User avatar + name */}
          <div style={{ padding: '16px 12px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', marginBottom: 10, border: '2px solid var(--accent-border)' }}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
              )}
            </div>
            <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--text)', margin: '0 0 2px' }}>{user?.name}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{user?.role}</p>
          </div>

          {/* Nav items */}
          {([
            { id: 'profile', icon: '👤', label: 'Profile' },
            { id: 'orders', icon: '📦', label: 'My Orders' },
            { id: 'wishlist', icon: '❤️', label: 'Wishlist' },
          ] as { id: Section; icon: string; label: string }[]).map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '11px 12px',
                borderRadius: 'var(--radius-md)',
                background: section === item.id ? 'var(--accent-dim)' : 'transparent',
                border: `1px solid ${section === item.id ? 'var(--accent-border)' : 'transparent'}`,
                color: section === item.id ? 'var(--accent)' : 'var(--text-sub)',
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                fontWeight: section === item.id ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: 2,
                transition: 'all 0.15s',
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        {/* ── Main Content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {section === 'profile' && <ProfileSection user={user} />}
          {section === 'orders' && <OrdersSection />}
          {section === 'wishlist' && <WishlistSection />}
        </div>
      </div>
    </div>
  )
}

// ── Profile Section ──────────────────────────────────────────────
function ProfileSection({ user }: { user: any }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
      <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 24 }}>
        Profile Information
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent-border)', flexShrink: 0 }}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>👤</div>
            )}
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--text)', margin: '0 0 4px' }}>{user?.name}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{user?.role}</p>
          </div>
        </div>

        {/* Fields */}
        {[
          { label: 'Full Name', value: user?.name },
          { label: 'Email', value: user?.email },
          { label: 'Role', value: user?.role },
        ].map(field => (
          <div key={field.label}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              {field.label}
            </label>
            <div style={{ padding: '11px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)' }}>
              {field.value || '—'}
            </div>
          </div>
        ))}

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 8 }}>
          Profile editing coming in a future update.
        </p>
      </div>
    </div>
  )
}

// ── Orders Section ───────────────────────────────────────────────
function OrdersSection() {
  const { data, isLoading } = useGetMyOrdersQuery({})
  const orders = data?.data?.orders || []

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
        <Spinner size={36} />
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 20 }}>
        My Orders
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginLeft: 10, fontWeight: 400 }}>
          ({orders.length})
        </span>
      </h2>

      {orders.length === 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>📦</p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-muted)', marginBottom: 16 }}>No orders yet</p>
          <Link to={ROUTES.CATALOG} style={{ background: 'var(--accent)', color: '#08080e', borderRadius: 'var(--radius-md)', padding: '10px 24px', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, textDecoration: 'none', letterSpacing: '0.08em' }}>
            START SHOPPING →
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {orders.map((order: any) => (
          <div key={order._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20 }}>

            {/* Order header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>
                  ORDER #{order._id.slice(-8).toUpperCase()}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: 4,
                  color: STATUS_COLORS[ order.orderStatus ] || 'var(--text-muted)',
                  background: `${STATUS_COLORS[ order.orderStatus ]}18` || 'transparent',
                  border: `1px solid ${STATUS_COLORS[ order.orderStatus ]}33` || 'var(--border)',
                }}>
                  {order.orderStatus}
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>

            {/* Order items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {order.items.map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=?' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{item.name}</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>Qty: {item.qty} × {formatCurrency(item.price)}</p>
                  </div>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--text)', flexShrink: 0 }}>
                    {formatCurrency(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* Order footer */}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                  Subtotal: {formatCurrency(order.itemsPrice)}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                  Tax: {formatCurrency(order.taxPrice)}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                  Shipping: {order.shippingPrice === 0 ? 'FREE' : formatCurrency(order.shippingPrice)}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
                Total: {formatCurrency(order.totalPrice)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Wishlist Section ─────────────────────────────────────────────
function WishlistSection() {
  const wishlistIds = useSelector(selectWishlist)

  // Fetch all products and filter by wishlist IDs
  const { data, isLoading } = useGetProductsQuery({}, { skip: wishlistIds.length === 0 })
  const allProducts = data?.data?.products || []
  const wishlistItems = allProducts
    .filter((p: any) => wishlistIds.includes(p._id))
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

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
        <Spinner size={36} />
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 20 }}>
        Wishlist
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', marginLeft: 10, fontWeight: 400 }}>
          ({wishlistIds.length})
        </span>
      </h2>

      {wishlistIds.length === 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>❤️</p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-muted)', marginBottom: 16 }}>Your wishlist is empty</p>
          <Link to={ROUTES.CATALOG} style={{ background: 'var(--accent)', color: '#08080e', borderRadius: 'var(--radius-md)', padding: '10px 24px', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, textDecoration: 'none', letterSpacing: '0.08em' }}>
            BROWSE PRODUCTS →
          </Link>
        </div>
      )}

      {wishlistItems.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {wishlistItems.map((p: any) => (
            <Link key={p.id} to={`/products/${p.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ height: 120, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=?' }} />
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>{p.name}</p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{formatCurrency(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}