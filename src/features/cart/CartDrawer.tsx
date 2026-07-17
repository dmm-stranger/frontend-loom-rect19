import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectIsAuth } from '@/features/auth/authSlice'
import { selectCartItems, selectCartTotal, removeItem, updateQty } from '@/features/cart/cartSlice'
import { useGetCartQuery, useRemoveCartItemMutation, useUpdateCartItemMutation } from '@/features/cart/cartApi'
import { closeCartDrawer, selectCartDrawerOpen } from '@/features/ui/uiSlice'
import { formatCurrency } from '@/utils/formatCurrency'
import { ROUTES } from '@/constants/routes'
import type { AppDispatch } from '@/app/store'

export default function CartDrawer() {
  const dispatch = useDispatch<AppDispatch>()
  const open = useSelector(selectCartDrawerOpen)
  const isAuth = useSelector(selectIsAuth)

  // Backend cart — when logged in
  const { data } = useGetCartQuery({}, { skip: !isAuth })
  const [ removeBackendItem ] = useRemoveCartItemMutation()
  const [ updateBackendItem ] = useUpdateCartItemMutation()

  // Redux cart — when not logged in
  const reduxItems = useSelector(selectCartItems)
  const reduxTotal = useSelector(selectCartTotal)

  // Use backend cart if logged in, otherwise Redux cart
  const backendCart = data?.data
  const items = isAuth
    ? (backendCart?.items || []).map((item: any) => ({
      productId: item.product,
      name: item.name,
      price: item.price,
      qty: item.qty,
      image: item.image,
      _id: item._id,
    }))
    : reduxItems

  const total = isAuth ? (backendCart?.total || 0) : reduxTotal

  const handleRemove = (item: any) => {
    if (isAuth) removeBackendItem(item.productId)
    else dispatch(removeItem(item.productId))
  }

  const handleUpdateQty = (item: any, qty: number) => {
    if (isAuth) updateBackendItem({ productId: item.productId, qty })
    else dispatch(updateQty({ productId: item.productId, qty }))
  }

  return (
    <>
      {open && (
        <div
          onClick={() => dispatch(closeCartDrawer())}
          style={{ position: 'fixed', inset: 0, background: '#00000080', zIndex: 40, backdropFilter: 'blur(2px)' }}
        />
      )}

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(360px, 92vw)', background: 'var(--bg-elevated)',
        borderLeft: '1px solid var(--border)', zIndex: 50, padding: 24,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', color: 'var(--text)', fontSize: 17, fontWeight: 700 }}>
            Cart <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>({items.length})</span>
          </h2>
          <button onClick={() => dispatch(closeCartDrawer())} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '6px 10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16 }}>✕</button>
        </div>

        {/* Empty */}
        {items.length === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ fontSize: 40 }}>🛒</span>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Your cart is empty</p>
            <Link to={ROUTES.CATALOG} onClick={() => dispatch(closeCartDrawer())} style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 12, textDecoration: 'none' }}>BROWSE CATALOG →</Link>
          </div>
        )}

        {/* Items */}
        {items.length > 0 && (
          <>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
              {items.map((item: any) => (
                <div key={item.productId} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, background: 'var(--accent-dim)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, overflow: 'hidden' }}>
                    {item.image?.startsWith('http') ? (
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>{item.image || '📦'}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, color: 'var(--text)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => handleUpdateQty(item, item.qty - 1)} disabled={item.qty <= 1} style={qtyBtn}>−</button>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)', minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                      <button onClick={() => handleUpdateQty(item, item.qty + 1)} style={qtyBtn}>+</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 13 }}>{formatCurrency(item.price * item.qty)}</span>
                    <button onClick={() => handleRemove(item)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--font-mono)' }}>REMOVE</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: 11 }}>TOTAL</span>
                <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 20 }}>{formatCurrency(total)}</span>
              </div>
              <Link to={ROUTES.CART} onClick={() => dispatch(closeCartDrawer())} style={{ display: 'block', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '11px 0', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', textDecoration: 'none', textAlign: 'center' }}>
                VIEW CART
              </Link>
              <Link to={ROUTES.CHECKOUT} onClick={() => dispatch(closeCartDrawer())} style={{ display: 'block', background: 'var(--accent)', color: '#08080e', borderRadius: 'var(--radius-md)', padding: '14px 0', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', textDecoration: 'none', textAlign: 'center' }}>
                CHECKOUT →
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}

const qtyBtn: React.CSSProperties = {
  width: 24, height: 24,
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  borderRadius: 4, color: 'var(--text-sub)',
  cursor: 'pointer', fontSize: 14,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}