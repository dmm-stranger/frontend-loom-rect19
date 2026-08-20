import { useState } from 'react'
import { Link } from 'react-router-dom'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { formatCurrency } from '@/utils/formatCurrency'
import { STOCK_FILTERS } from '@/constants/adminStatus'
import { PageHeader, cardStyle, inputStyle, Table, tdStyle, Badge, Pagination, Button } from '@/components/admin/AdminUI'
import {
  useGetAdminProductsQuery,
  useToggleFeaturedMutation,
  useDeleteProductMutation,
  useUpdateStockMutation,
} from '@/features/admin/adminProductsApi'
import { useGetCategoriesQuery } from '@/features/products/productsApi'
import { useDebounce } from '@/hooks/useDebounce'

// Inline-editable stock cell. Click the badge to reveal a number input;
// Enter/blur saves via PATCH /admin/products/:id/stock, Escape cancels.
function StockCell({ id, stock }: { id: string; stock: number }) {
  const [ updateStock, { isLoading: saving } ] = useUpdateStockMutation()
  const [ editing, setEditing ] = useState(false)
  const [ value, setValue ] = useState(String(stock))

  const color = stock === 0 ? 'var(--danger)' : stock <= 5 ? 'var(--gold)' : 'var(--success)'

  const commit = async () => {
    const next = Number(value)
    setEditing(false)
    if (Number.isNaN(next) || next < 0 || next === stock) { setValue(String(stock)); return }
    try {
      await updateStock({ id, stock: next }).unwrap()
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to update stock')
      setValue(String(stock))
    }
  }

  if (editing) {
    return (
      <input
        type="number"
        min="0"
        autoFocus
        value={value}
        disabled={saving}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') { setValue(String(stock)); setEditing(false) }
        }}
        style={{ ...inputStyle, width: 70, padding: '4px 8px', fontSize: 12 }}
      />
    )
  }

  return (
    <button
      onClick={() => { setValue(String(stock)); setEditing(true) }}
      title="Click to edit stock"
      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <Badge text={String(stock)} color={color} />
    </button>
  )
}

export default function AdminProductsList() {
  const [ page, setPage ] = useState(1)
  const [ search, setSearch ] = useState('')
  const [ category, setCategory ] = useState('')
  const [ stock, setStock ] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading, isFetching } = useGetAdminProductsQuery({
    page, limit: 20, search: debouncedSearch || undefined, category: category || undefined, stock: stock || undefined,
  })
  const { data: catData } = useGetCategoriesQuery({})
  const categories = catData?.data?.categories || []
  const products = data?.data?.products || []
  const pagination = data?.data?.pagination || { page: 1, pages: 1 }

  const [ toggleFeatured ] = useToggleFeaturedMutation()
  const [ deleteProduct, { isLoading: deleting } ] = useDeleteProductMutation()

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This also removes its images from storage.`)) return
    try {
      await deleteProduct(id).unwrap()
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to delete product')
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        action={<Link to="/admin/products/new" style={{ textDecoration: 'none' }}><Button>+ NEW PRODUCT</Button></Link>}
      />

      <div style={{ ...cardStyle, marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          placeholder="Search products…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          style={{ ...inputStyle, flex: 1, minWidth: 200 }}
        />
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1) }} style={{ ...inputStyle, maxWidth: 180 }}>
          <option value="">All categories</option>
          {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select value={stock} onChange={(e) => { setStock(e.target.value); setPage(1) }} style={{ ...inputStyle, maxWidth: 180 }}>
          {STOCK_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>

      <div style={cardStyle}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}><Spinner size={32} /></div>
        ) : products.length === 0 ? (
          <EmptyState icon="🖥️" title="No products found" message="Try a different search or filter." />
        ) : (
          <>
            {isFetching && <div style={{ marginBottom: 10 }}><Spinner size={18} /></div>}
            <Table headers={[ 'Product', 'Category', 'Price', 'Stock', 'Featured', '' ]}>
              {products.map((p: any) => (
                <tr key={p._id}>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0 }}>
                        <img src={p.images?.[0]?.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80?text=?' }} />
                      </div>
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>{p.category?.name || '—'}</td>
                  <td style={tdStyle}>{formatCurrency(p.discountPrice || p.price)}</td>
                  <td style={tdStyle}>
                    <StockCell id={p._id} stock={p.stock} />
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => toggleFeatured(p._id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 16 }}
                      title={p.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      {p.isFeatured ? '⭐' : '☆'}
                    </button>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <Link to={`/admin/products/${p._id}/edit`} style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11, textDecoration: 'none' }}>EDIT</Link>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        disabled={deleting}
                        style={{ background: 'transparent', border: 'none', color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer' }}
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
            <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
