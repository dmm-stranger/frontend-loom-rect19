import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export default function NotFoundPage() {
  return (
    <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '80px 28px', textAlign: 'center', color: 'var(--text)' }}>
      <p style={{ fontSize: 64, marginBottom: 16 }}>404</p>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Page not found</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>That page doesn't exist or was moved.</p>
      <Link to={ROUTES.HOME} style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)', borderRadius: 'var(--radius-md)', padding: '10px 24px', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>← BACK TO HOME</Link>
    </div>
  )
}