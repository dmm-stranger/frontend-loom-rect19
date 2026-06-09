import { Outlet, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/features/cart/CartDrawer'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { selectMobileMenuOpen, closeMobileMenu } from '@/features/ui/uiSlice'
import { ROUTES } from '@/constants/routes'
import { NAV_LINKS } from '@/constants/categories'
import type { AppDispatch } from '@/app/store'

export default function RootLayout() {
  const dispatch = useDispatch<AppDispatch>()
  const mobileMenuOpen = useSelector(selectMobileMenuOpen)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div style={{ width: 240, background: 'var(--bg-elevated)', borderRight: '1px solid var(--border)', padding: 24, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em' }}>MENU</span>
              <button onClick={() => dispatch(closeMobileMenu())} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            {NAV_LINKS.map(n => (
              <Link
                key={n}
                to={`${ROUTES.CATALOG}?category=${n.toLowerCase()}`}
                onClick={() => dispatch(closeMobileMenu())}
                style={{ color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 15, padding: '12px 0', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
              >
                {n}
              </Link>
            ))}
          </div>
          <div onClick={() => dispatch(closeMobileMenu())} style={{ flex: 1, background: '#00000070', backdropFilter: 'blur(2px)' }} />
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer />

      <main style={{ flex: 1 }}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  )
}