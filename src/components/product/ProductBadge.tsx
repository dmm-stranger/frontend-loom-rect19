interface ProductBadgeProps {
  type: 'HOT' | 'NEW' | 'SALE' | 'DEAL' | null
}

const badgeColors: Record<string, { bg: string; color: string; border: string }> = {
  HOT: { bg: '#ff4d6a18', color: '#ff4d6a', border: '#ff4d6a33' },
  NEW: { bg: '#00cfff18', color: '#00cfff', border: '#00cfff33' },
  SALE: { bg: '#f59e0b18', color: '#f59e0b', border: '#f59e0b33' },
  DEAL: { bg: '#00e59918', color: '#00e599', border: '#00e59933' },
}

export default function ProductBadge({ type }: ProductBadgeProps) {
  if (!type) return null
  const c = badgeColors[ type ]
  return (
    <span style={{
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.12em',
      padding: '2px 7px',
      borderRadius: 4,
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      fontFamily: 'var(--font-mono)',
    }}>
      {type}
    </span>
  )
}