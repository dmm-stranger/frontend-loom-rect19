import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { CATEGORIES } from '@/constants/categories'

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '80px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 24 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 14px', border: '1px solid var(--accent-border)', borderRadius: 100, background: 'var(--accent-dim)' }}>
          ⚡ New arrivals — RTX 5090 in stock
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 800, lineHeight: 1.05, maxWidth: 700 }}>
          Next-Gen Tech.<br />
          <span style={{ color: 'var(--accent)' }}>Delivered Fast.</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text-sub)', maxWidth: 460, lineHeight: 1.65 }}>
          Premium electronics, cutting-edge components, and the latest gear.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to={ROUTES.CATALOG} style={{ background: 'var(--accent)', color: '#08080e', borderRadius: 'var(--radius-md)', padding: '14px 28px', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textDecoration: 'none' }}>
            SHOP NOW →
          </Link>
          <Link to="/catalog?filter=deals" style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px 28px', fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.1em', textDecoration: 'none' }}>
            VIEW DEALS
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 28px 80px' }}>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Shop by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
          {CATEGORIES.map(cat => (
            <Link key={cat.id} to={`/catalog/${cat.slug}`} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px 16px', textAlign: 'center', textDecoration: 'none', color: 'var(--text)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 32 }}>{cat.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{cat.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{cat.count} items</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}