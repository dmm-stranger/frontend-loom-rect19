import { useDispatch, useSelector } from 'react-redux'
import { toggleBrandFilter, setPriceRange, setRatingFilter, clearFilters, selectFilters } from '@/features/products/productsSlice'
import type { AppDispatch } from '@/app/store'

const BRANDS = [ 'NVIDIA', 'AMD', 'Intel', 'Apple', 'Samsung', 'Corsair' ]
const PRICE_RANGES = [
  { label: 'Under $200', value: '0-200' },
  { label: '$200 – $500', value: '200-500' },
  { label: '$500 – $1,000', value: '500-1000' },
  { label: '$1,000 – $2,000', value: '1000-2000' },
  { label: '$2,000+', value: '2000-99999' },
]
const RATINGS = [
  { label: '4★ & above', value: 4 },
  { label: '3★ & above', value: 3 },
]

interface SidebarProps {
  asDrawer?: boolean
  onClose?: () => void
}

export default function Sidebar({ asDrawer = false, onClose }: SidebarProps) {
  const dispatch = useDispatch<AppDispatch>()
  const filters = useSelector(selectFilters)
  const hasFilters = filters.brands.length > 0 || filters.priceRange || filters.rating

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>FILTERS</span>
        {hasFilters && <button onClick={() => dispatch(clearFilters())} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: 10, cursor: 'pointer' }}>CLEAR ALL</button>}
      </div>

      {/* Brands */}
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Brand</p>
        {BRANDS.map(brand => {
          const active = filters.brands.includes(brand)
          return (
            <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', marginBottom: 7 }}>
              <div onClick={() => dispatch(toggleBrandFilter(brand))} style={{ width: 13, height: 13, borderRadius: 3, border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`, background: active ? 'var(--accent)' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: active ? 'var(--text)' : 'var(--text-sub)' }}>{brand}</span>
            </label>
          )
        })}
      </div>

      {/* Price */}
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Price Range</p>
        {PRICE_RANGES.map(r => {
          const active = filters.priceRange === r.value
          return (
            <label key={r.value} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', marginBottom: 7 }}>
              <div onClick={() => dispatch(setPriceRange(active ? null : r.value))} style={{ width: 13, height: 13, borderRadius: '50%', border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`, background: active ? 'var(--accent)' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: active ? 'var(--text)' : 'var(--text-sub)' }}>{r.label}</span>
            </label>
          )
        })}
      </div>

      {/* Rating */}
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Rating</p>
        {RATINGS.map(r => {
          const active = filters.rating === r.value
          return (
            <label key={r.value} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', marginBottom: 7 }}>
              <div onClick={() => dispatch(setRatingFilter(active ? null : r.value))} style={{ width: 13, height: 13, borderRadius: '50%', border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`, background: active ? 'var(--accent)' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: active ? 'var(--text)' : 'var(--text-sub)' }}>{r.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )

  if (asDrawer) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex' }}>
        <div onClick={onClose} style={{ flex: 1, background: '#00000070', backdropFilter: 'blur(3px)' }} />
        <div style={{ width: 260, background: 'var(--bg-elevated)', borderLeft: '1px solid var(--border)', padding: 24, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em' }}>FILTERS</span>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>✕</button>
          </div>
          {content}
        </div>
      </div>
    )
  }

  return (
    <aside style={{ width: 'var(--sidebar-w)', flexShrink: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20, position: 'sticky', top: 'calc(var(--header-h) + 16px)', alignSelf: 'flex-start' }}>
      {content}
    </aside>
  )
}