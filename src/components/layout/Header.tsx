import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { openCartDrawer, openMobileMenu, toggleTheme, selectTheme } from '@/features/ui/uiSlice'
import { selectCartCount } from '@/features/cart/cartSlice'
import { useGetCartQuery } from '@/features/cart/cartApi'
import { selectIsAuth, selectIsAdmin } from '@/features/auth/authSlice'
import { useLogoutUserMutation } from '@/features/auth/authApi'
import { ROUTES } from '@/constants/routes'
import { useGetCategoriesQuery } from '@/features/products/productsApi'
import { useDebounce } from '@/hooks/useDebounce'
import type { AppDispatch } from '@/app/store'


export default function Header() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()

  const reduxCartCount = useSelector(selectCartCount)
  const isAuth = useSelector(selectIsAuth)
  const isAdmin = useSelector(selectIsAdmin)

  // Backend cart count when logged in
  const { data: cartData } = useGetCartQuery({}, { skip: !isAuth })
  const cartCount = isAuth
    ? (cartData?.data?.itemCount || 0)
    : reduxCartCount
  const theme = useSelector(selectTheme)

  // Real categories from the DB, driving the nav links — the old hardcoded
  // list (GPUs/CPUs/Storage/Deals) didn't match what's actually seeded, so
  // most category links 404'd with "product not found".
  const { data: categoriesData } = useGetCategoriesQuery({})
  const navCategories = categoriesData?.data?.categories || []

  const [ searchVal, setSearchVal ] = useState('')
  const [ searchFocused, setSearchFocused ] = useState(false)
  const [ userMenuOpen, setUserMenuOpen ] = useState(false)
  const [ logoutUser ] = useLogoutUserMutation()

  const debouncedSearch = useDebounce(searchVal, 400)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (debouncedSearch.trim()) {
      navigate(`${ROUTES.CATALOG}?search=${encodeURIComponent(debouncedSearch)}`)
    }
  }

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 30,
      height: 'var(--header-h)',
      background: '#08080eee',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* Hamburger — mobile only, opens the mobile menu (nav links live there on small screens) */}
        <button className="mobile-only" onClick={() => dispatch(openMobileMenu())} style={iconBtn}>☰</button>

        {/* Logo */}
        <Link to={ROUTES.HOME} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ width: 30, height: 30, background: 'var(--accent)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#08080e', fontWeight: 900, fontSize: 14 }}>T</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: 'var(--text)', letterSpacing: '0.05em' }}>
            TECH<span style={{ color: 'var(--accent)' }}>STORE</span>
          </span>
        </Link>

        {/* Nav — hidden on mobile; links live in the hamburger menu instead */}
        <nav className="desktop-only" style={{ display: 'flex', gap: 2 }}>
          {navCategories.map((cat: any) => {
            const linkPath = `${ROUTES.CATALOG}/${cat.slug}`
            const isActive = location.pathname.toLowerCase() === linkPath.toLowerCase()
            return (
              <Link key={cat._id} to={linkPath} style={{
                color: isActive ? 'var(--accent)' : 'var(--text-sub)',
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: isActive ? 700 : 400,
                padding: '6px 10px', borderRadius: 'var(--radius-sm)', textDecoration: 'none',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                transition: 'color 0.15s, background 0.15s',
              }}>
                {cat.name}
              </Link>
            )
          })}
        </nav>

        {/* Search — full bar on desktop */}
        <form onSubmit={handleSearch} className="desktop-only" style={{
          flex: 1, maxWidth: 380, marginLeft: 'auto', position: 'relative',
          border: `1px solid ${searchFocused ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)', overflow: 'hidden', transition: 'border-color 0.2s',
        }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
          <input
            type="text"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search products…"
            style={{
              width: '100%', padding: '9px 12px 9px 36px',
              background: 'var(--bg-card)', border: 'none',
              color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 13, outline: 'none',
            }}
          />
        </form>

        {/* Search — icon only on mobile, opens the catalog search */}
        <Link
          to={ROUTES.CATALOG}
          className="mobile-only"
          style={{ ...iconBtn, marginLeft: 'auto', textDecoration: 'none', alignItems: 'center', justifyContent: 'center' }}
        >
          🔍
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          style={{
            ...iconBtn,
            fontSize: 16,
            lineHeight: 1,
          }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* User — with dropdown when logged in */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserMenuOpen(v => !v)}
            style={{ ...iconBtn, fontSize: 16 }}
          >
            {isAuth ? '👤' : '🔑'}
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                onClick={() => setUserMenuOpen(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 10 }}
              />
              {/* Menu */}
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                zIndex: 20,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                minWidth: 180,
                overflow: 'hidden',
                boxShadow: '0 8px 32px #00000040',
              }}>
                {isAuth ? (
                  <>
                    <Link
                      to={ROUTES.ACCOUNT}
                      onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'block', padding: '12px 16px', color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 13, textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
                    >
                      👤 My Account
                    </Link>
                    <Link
                      to="/account/orders"
                      onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'block', padding: '12px 16px', color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 13, textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
                    >
                      📦 My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        style={{ display: 'block', padding: '12px 16px', color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontSize: 13, textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
                      >
                        🛠️ Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { logoutUser(undefined); setUserMenuOpen(false) }}
                      style={{ display: 'block', width: '100%', padding: '12px 16px', color: 'var(--danger)', fontFamily: 'var(--font-sans)', fontSize: 13, textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      🚪 Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to={ROUTES.LOGIN}
                      onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'block', padding: '12px 16px', color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 13, textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
                    >
                      🔑 Sign In
                    </Link>
                    <Link
                      to={ROUTES.REGISTER}
                      onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'block', padding: '12px 16px', color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 13, textDecoration: 'none' }}
                    >
                      ✏️ Create Account
                    </Link>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Cart */}
        <button onClick={() => dispatch(openCartDrawer())} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'var(--accent-dim)', border: '1px solid var(--accent-border)',
          borderRadius: 'var(--radius-md)', padding: '7px 14px',
          cursor: 'pointer', color: 'var(--accent)',
          fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em',
        }}>
          🛒
          {cartCount > 0 && (
            <span style={{
              background: 'var(--accent)', color: '#08080e', borderRadius: 100,
              width: 17, height: 17, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 9, fontWeight: 900,
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}

const iconBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  padding: '7px 9px',
  cursor: 'pointer',
  color: 'var(--text-sub)',
}