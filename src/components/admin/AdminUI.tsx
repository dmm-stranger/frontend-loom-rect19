import type { CSSProperties, ReactNode } from 'react'

export const cardStyle: CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: 20,
}

export const labelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  color: 'var(--text-muted)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
}

export const inputStyle: CSSProperties = {
  width: '100%',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 12px',
  color: 'var(--text)',
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  outline: 'none',
}

export function PageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 22, color: 'var(--text)' }}>{title}</h1>
      {action}
    </div>
  )
}

export function Button({
  children, onClick, variant = 'primary', disabled, type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  const styles: Record<string, CSSProperties> = {
    primary: { background: 'var(--accent)', color: '#08080e', border: '1px solid var(--accent)' },
    ghost: { background: 'transparent', color: 'var(--text-sub)', border: '1px solid var(--border)' },
    danger: { background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)' },
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[ variant ],
        borderRadius: 'var(--radius-md)',
        padding: '9px 18px',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.06em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

export function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        padding: '3px 9px', borderRadius: 4,
        color, background: `${color}18`, border: `1px solid ${color}33`,
      }}
    >
      {text}
    </span>
  )
}

export function Pagination({
  page, pages, onChange,
}: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 24 }}>
      <Button variant="ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>← PREV</Button>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-sub)' }}>
        Page {page} of {pages}
      </span>
      <Button variant="ghost" disabled={page >= pages} onClick={() => onChange(page + 1)}>NEXT →</Button>
    </div>
  )
}

export function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid var(--border)',
                  ...labelStyle, fontSize: 10,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export const tdStyle: CSSProperties = {
  padding: '12px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--text)',
}
