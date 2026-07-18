import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { openCartDrawer, openMobileMenu, toggleTheme, selectTheme } from '@/features/ui/uiSlice'
import { selectCartCount } from '@/features/cart/cartSlice'
import { useGetCartQuery } from '@/features/cart/cartApi'
import { selectIsAuth, logout } from '@/features/auth/authSlice'
import { ROUTES } from '@/constants/routes'
import { NAV_LINKS } from '@/constants/categories'
import { useDebounce } from '@/hooks/useDebounce'
import type { AppDispatch } from '@/app/store'


export default function Header() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const reduxCartCount = useSelector(selectCartCount)
  const isAuth = useSelector(selectIsAuth)

  // Backend cart count when logged in
  const { data: cartData } = useGetCartQuery({}, { skip: !isAuth })
  const cartCount = isAuth
    ? (cartData?.data?.itemCount || 0)
    : reduxCartCount
  const theme = useSelector(selectTheme)

  const [ searchVal, setSearchVal ] = useState('')
  const [ searchFocused, setSearchFocused ] = useState(false)
  const [ userMenuOpen, setUserMenuOpen ] = useState(false)

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

        {/* Hamburger */}
        <button onClick={() => dispatch(openMobileMenu())} style={iconBtn}>☰</button>

        {/* Logo */}
        <Link to={ROUTES.HOME} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ width: 30, height: 30, background: 'var(--accent)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#08080e', fontWeight: 900, fontSize: 14 }}>T</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: 'var(--text)', letterSpacing: '0.05em' }}>
            TECH<span style={{ color: 'var(--accent)' }}>STORE</span>
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: 2 }}>
          {NAV_LINKS.map(link => (
            <Link key={link} to={`${ROUTES.CATALOG}?category=${link.toLowerCase()}`} style={{
              color: 'var(--text-sub)', fontFamily: 'var(--font-sans)', fontSize: 13,
              padding: '6px 10px', borderRadius: 'var(--radius-sm)', textDecoration: 'none',
            }}>
              {link}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} style={{
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
            placeholder="Search GPUs, laptops, peripherals…"
            style={{
              width: '100%', padding: '9px 12px 9px 36px',
              background: 'var(--bg-card)', border: 'none',
              color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 13, outline: 'none',
            }}
          />
        </form>

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
                    <button
                      onClick={() => { dispatch(logout()); setUserMenuOpen(false) }}
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