import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

const COLS = [
  { title: 'Shop', links: [ { label: 'Laptops', to: '/catalog/laptops' }, { label: 'GPUs', to: '/catalog/gpus' }, { label: 'Monitors', to: '/catalog/monitors' }, { label: 'Peripherals', to: '/catalog/peripherals' } ] },
  { title: 'Support', links: [ { label: 'Track Order', to: ROUTES.ACCOUNT }, { label: 'Returns', to: '#' }, { label: 'Warranty', to: '#' }, { label: 'Contact', to: '#' } ] },
  { title: 'Company', links: [ { label: 'About', to: '#' }, { label: 'Blog', to: '#' }, { label: 'Careers', to: '#' }, { label: 'Partners', to: '#' } ] },
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)', padding: '44px 0 28px', marginTop: 60 }}>
      <div className="container">
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', marginBottom: 40 }}>

          {/* Brand */}
          <div style={{ minWidth: 200 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, letterSpacing: '0.05em', marginBottom: 10 }}>
              TECH<span style={{ color: 'var(--accent)' }}>STORE</span>
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: 190 }}>
              Premium electronics and tech gear for enthusiasts and professionals.
            </p>
          </div>

          {/* Link columns */}
          {COLS.map(col => (
            <div key={col.title} style={{ minWidth: 120 }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>{col.title}</p>
              {col.links.map(lnk => (
                <Link key={lnk.label} to={lnk.to} style={{ display: 'block', fontSize: 12, color: 'var(--text-sub)', marginBottom: 7, textDecoration: 'none' }}>{lnk.label}</Link>
              ))}
            </div>
          ))}

          {/* Newsletter */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>NEWSLETTER</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="email" placeholder="your@email.com" style={{ flex: 1, padding: '9px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 12, outline: 'none' }} />
              <button style={{ background: 'var(--accent)', color: '#08080e', border: 'none', borderRadius: 'var(--radius-md)', padding: '9px 14px', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>JOIN</button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>© 2026 TechStore Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 16 }}>
            {[ 'Privacy', 'Terms', 'Cookies' ].map(l => (
              <a key={l} href="#" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}