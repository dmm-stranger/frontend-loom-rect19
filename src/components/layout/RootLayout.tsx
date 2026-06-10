import { Outlet, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/features/cart/CartDrawer'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { selectMobileMenuOpen, closeMobileMenu } from '@/features/ui/uiSlice'
import { ROUTES, NAV_LINKS } from '@/constants/routes'
import { CATEGORIES } from '@/constants/categories'
import type { AppDispatch } from '@/app/store'

export default function RootLayout() {
  const dispatch = useDispatch<AppDispatch>()
  const mobileMenuOpen = useSelector(selectMobileMenuOpen)

  return (
    <>
      {/* ── Fixed overlays ── */}
      <CartDrawer />

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div style={{ width: 240, background: 'var(--bg-elevated)', borderRight: '1px solid var(--border)', padding: 24, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em' }}>MENU</span>
              <button onClick={() => dispatch(closeMobileMenu())} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                to={`/catalog/${cat.slug}`}
                onClick={() => dispatch(closeMobileMenu())}
                style={{ color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 15, padding: '12px 0', textDecoration: 'none', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </Link>
            ))}
          </div>
          <div onClick={() => dispatch(closeMobileMenu())} style={{ flex: 1, background: '#00000070', backdropFilter: 'blur(2px)' }} />
        </div>
      )}

      {/* ── Page layout ── */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        {/* ── Category Strip ── */}
        <div style={{
          borderBottom: '1px solid var(--border)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          <div style={{
            maxWidth: 'var(--max-w)',
            margin: '0 auto',
            padding: '0 28px',
            display: 'flex',
            gap: 4,
            minWidth: 'max-content',
          }}>
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/catalog/${cat.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '12px 14px',
                  textDecoration: 'none',
                  color: i === 0 ? 'var(--accent)' : 'var(--text-sub)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 13,
                  whiteSpace: 'nowrap',
                  borderBottom: i === 0 ? '2px solid var(--accent)' : '2px solid transparent',
                  transition: 'color 0.15s',
                }}
              >
                <span style={{ fontSize: 16 }}>{cat.icon}</span>
                {cat.label}
                <span style={{
                  fontSize: 9,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 100,
                  padding: '1px 6px',
                }}>
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <main style={{ flex: 1 }}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>

        <Footer />
      </div>
    </>
  )
}