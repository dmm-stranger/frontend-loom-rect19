export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    }}>
      <h1 style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 32 }}>
        TECH<span style={{ color: 'var(--text)' }}>STORE</span>
      </h1>
      <p style={{ color: 'var(--text-sub)', fontFamily: 'var(--font-sans)', fontSize: 16 }}>
        CSS variables are working ✅
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 80, height: 80, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />
        <div style={{ width: 80, height: 80, background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-md)' }} />
        <div style={{ width: 80, height: 80, background: 'var(--success)', borderRadius: 'var(--radius-md)' }} />
        <div style={{ width: 80, height: 80, background: 'var(--danger)', borderRadius: 'var(--radius-md)' }} />
      </div>
    </div>
  )
}