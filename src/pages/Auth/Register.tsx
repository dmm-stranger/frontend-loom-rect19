import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export default function RegisterPage() {
  return (
    <div style={{ maxWidth: 420, margin: '80px auto', padding: '0 24px', color: 'var(--text)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', marginBottom: 12 }}>AUTH — Phase 5</p>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Create Account</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Full register form coming in Phase 5.</p>
      <Link to={ROUTES.LOGIN} style={{ color: 'var(--accent)' }}>Already have an account? →</Link>
    </div>
  )
}