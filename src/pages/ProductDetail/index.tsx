import { useParams } from 'react-router-dom'

export default function ProductDetail() {
  const { productId } = useParams()
  return (
    <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '48px 28px', color: 'var(--text)' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', marginBottom: 12 }}>PRODUCT DETAIL — Phase 3</p>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Product #{productId}</h1>
    </div>
  )
}
