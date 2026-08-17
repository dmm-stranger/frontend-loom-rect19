import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/admin', end: true, icon: '📊', label: 'Dashboard' },
  { to: '/admin/orders', icon: '📦', label: 'Orders' },
  { to: '/admin/products', icon: '🖥️', label: 'Products' },
  { to: '/admin/categories', icon: '🗂️', label: 'Categories' },
  { to: '/admin/users', icon: '👥', label: 'Users' },
  { to: '/admin/coupons', icon: '🏷️', label: 'Coupons' },
  { to: '/admin/reviews', icon: '⭐', label: 'Reviews' },
  { to: '/admin/settings', icon: '⚙️', label: 'Settings' },
]

export default function AdminSidebar() {
  return (
    <aside
      style={{
        width: 'var(--sidebar-w)',
        flexShrink: 0,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 16,
        position: 'sticky',
        top: 'calc(var(--header-h) + 16px)',
        alignSelf: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--accent)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          padding: '4px 10px 12px',
        }}
      >
        ADMIN PANEL
      </span>

      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 10px',
            borderRadius: 'var(--radius-sm)',
            textDecoration: 'none',
            fontSize: 13,
            fontFamily: 'var(--font-sans)',
            color: isActive ? 'var(--accent)' : 'var(--text-sub)',
            background: isActive ? 'var(--accent-dim)' : 'transparent',
            border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
            transition: 'all 0.15s',
          })}
        >
          <span style={{ fontSize: 15 }}>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </aside>
  )
}
