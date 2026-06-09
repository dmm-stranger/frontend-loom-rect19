interface EmptyStateProps {
  icon?: string
  title?: string
  message?: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({
  icon = '📦',
  title = 'Nothing here yet',
  message = 'Try adjusting your filters or search.',
  action,
}: EmptyStateProps) {
  return (
    <div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--text)' }}>
      <p style={{ fontSize: 48, marginBottom: 16 }}>{icon}</p>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent-border)',
            color: 'var(--accent)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 24px',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            cursor: 'pointer',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}