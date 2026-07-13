import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '@/features/auth/authApi'
import { selectIsAuth } from '@/features/auth/authSlice'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/constants/routes'

export default function RegisterPage() {
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth)

  const [ name, setName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ confirm, setConfirm ] = useState('')
  const [ error, setError ] = useState('')

  const [ register, { isLoading } ] = useRegisterMutation()

  useEffect(() => {
    if (isAuth) navigate(ROUTES.HOME, { replace: true })
  }, [ isAuth, navigate ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) return setError('Name is required')
    if (!email.trim()) return setError('Email is required')
    if (!password.trim()) return setError('Password is required')
    if (password !== confirm) return setError('Passwords do not match')
    if (password.length < 6) return setError('Password must be at least 6 characters')

    try {
      await register({ name, email, password }).unwrap()
      navigate(ROUTES.HOME, { replace: true })
    } catch (err: any) {
      setError(err?.data?.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 32,
      }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
            Get started
          </p>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 24, color: 'var(--text)', margin: 0 }}>
            Create Account
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#ff4d6a18', border: '1px solid #ff4d6a33', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 20 }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--danger)', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Name */}
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              style={{ width: '100%', padding: '11px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '11px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '11px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleSubmit(e as any)}
              style={{ width: '100%', padding: '11px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              background: isLoading ? 'var(--border)' : 'var(--accent)',
              color: '#08080e',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '13px 0',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.1em',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              marginTop: 4,
            }}
          >
            {isLoading ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT →'}
          </button>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid var(--border)', marginTop: 24, paddingTop: 20, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}