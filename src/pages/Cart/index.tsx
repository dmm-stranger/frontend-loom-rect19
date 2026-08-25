import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuth } from '@/features/auth/authSlice'
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from '@/features/cart/cartApi'
import { formatCurrency } from '@/utils/formatCurrency'
import Spinner from '@/components/common/Spinner'
import { ROUTES } from '@/constants/routes'

export default function CartPage() {
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth)

  const { data, isLoading } = useGetCartQuery({}, { skip: !isAuth })
  const [ updateItem ] = useUpdateCartItemMutation()
  const [ removeItem ] = useRemoveCartItemMutation()
  const [ clearCart, { isLoading: clearing } ] = useClearCartMutation()

  const cart = data?.data
  const items = cart?.items || []

  // Not logged in
  if (!isAuth) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>🛒</p>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 22, color: 'var(--text)', marginBottom: 10 }}>
          Sign in to view your cart
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
          Your cart is saved to your account.
        </p>
        <Link to={ROUTES.LOGIN} style={{ background: 'var(--accent)', color: '#08080e', borderRadius: 'var(--radius-md)', padding: '12px 28px', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, textDecoration: 'none', letterSpacing: '0.1em' }}>
          SIGN IN →
        </Link>
      </div>
    )
  }

  // Loading
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <Spinner size={40} />
      </div>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>🛒</p>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 22, color: 'var(--text)', marginBottom: 10 }}>
          Your cart is empty
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
          Add some products to get started.
        </p>
        <Link to={ROUTES.CATALOG} style={{ background: 'var(--accent)', color: '#08080e', borderRadius: 'var(--radius-md)', padding: '12px 28px', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, textDecoration: 'none', letterSpacing: '0.1em' }}>
          BROWSE PRODUCTS →
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '32px 28px' }}>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 24, color: 'var(--text)', marginBottom: 28 }}>
        Shopping Cart
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', marginLeft: 12, fontWeight: 400 }}>
          ({cart?.itemCount} items)
        </span>
      </h1>

      <div className="stack-on-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'flex-start' }}>

        {/* ── Cart Items ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Clear cart button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
            <button
              onClick={() => clearCart({})}
              disabled={clearing}
              style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', padding: '6px 14px', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', cursor: 'pointer' }}
            >
              {clearing ? 'CLEARING…' : 'CLEAR CART'}
            </button>
          </div>

          {items.map((item: any) => (
            <div key={item._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 18, display: 'flex', gap: 16, alignItems: 'center' }}>

              {/* Image */}
              <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=?' }}
                />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.name}
                </p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
                  {formatCurrency(item.price)}
                </p>

                {/* Qty controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', width: 'fit-content' }}>
                  <button
                    onClick={() => updateItem({ productId: item.product, qty: item.qty - 1 })}
                    disabled={item.qty <= 1}
                    style={{ width: 32, height: 32, background: 'var(--bg-elevated)', border: 'none', color: 'var(--text)', fontSize: 16, cursor: item.qty <= 1 ? 'not-allowed' : 'pointer', opacity: item.qty <= 1 ? 0.4 : 1 }}
                  >−</button>
                  <span style={{ width: 36, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)', background: 'var(--bg-card)' }}>
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateItem({ productId: item.product, qty: item.qty + 1 })}
                    style={{ width: 32, height: 32, background: 'var(--bg-elevated)', border: 'none', color: 'var(--text)', fontSize: 16, cursor: 'pointer' }}
                  >+</button>
                </div>
              </div>

              {/* Right: total + remove */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>
                  {formatCurrency(item.price * item.qty)}
                </span>
                <button
                  onClick={() => removeItem(item.product)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', cursor: 'pointer' }}
                >
                  REMOVE
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Order Summary ── */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, position: 'sticky', top: 'calc(var(--header-h) + 16px)' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 17, color: 'var(--text)', marginBottom: 20 }}>
            Order Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text)' }}>{formatCurrency(cart?.subtotal || 0)}</span>
            </div>
            {cart?.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--success)' }}>Discount</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--success)' }}>-{formatCurrency(cart.discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)' }}>Shipping</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--success)' }}>FREE</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 20, color: 'var(--text)' }}>{formatCurrency(cart?.total || 0)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate(ROUTES.CHECKOUT)}
            style={{ width: '100%', background: 'var(--accent)', color: '#08080e', border: 'none', borderRadius: 'var(--radius-md)', padding: '14px 0', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', cursor: 'pointer' }}
          >
            PROCEED TO CHECKOUT →
          </button>

          <Link to={ROUTES.CATALOG} style={{ display: 'block', textAlign: 'center', marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none', letterSpacing: '0.08em' }}>
            ← CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  )
}