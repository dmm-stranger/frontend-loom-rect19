import { useState } from 'react'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { PageHeader, cardStyle, labelStyle, inputStyle, Table, tdStyle, Badge, Button } from '@/components/admin/AdminUI'
import {
  useGetAdminCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from '@/features/admin/adminCouponsApi'

interface FormState {
  id?: string
  code: string
  discountPercent: string
  minOrderAmount: string
  maxUses: string
  expiresAt: string
}

const EMPTY_FORM: FormState = { code: '', discountPercent: '', minOrderAmount: '', maxUses: '', expiresAt: '' }

export default function AdminCoupons() {
  const { data, isLoading } = useGetAdminCouponsQuery({})
  const coupons = data?.data?.coupons || []

  const [ createCoupon, { isLoading: creating } ] = useCreateCouponMutation()
  const [ updateCoupon, { isLoading: updating } ] = useUpdateCouponMutation()
  const [ deleteCoupon ] = useDeleteCouponMutation()

  const [ form, setForm ] = useState<FormState | null>(null)
  const [ error, setError ] = useState('')
  const saving = creating || updating

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    setError('')
    const payload = {
      code: form.code,
      discountPercent: Number(form.discountPercent),
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
      expiresAt: form.expiresAt,
    }
    try {
      if (form.id) {
        await updateCoupon({ id: form.id, ...payload }).unwrap()
      } else {
        await createCoupon(payload).unwrap()
      }
      setForm(null)
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to save coupon')
    }
  }

  const toggleActive = async (c: any) => {
    try {
      await updateCoupon({ id: c._id, isActive: !c.isActive }).unwrap()
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to update coupon')
    }
  }

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return
    try {
      await deleteCoupon(id).unwrap()
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to delete coupon')
    }
  }

  return (
    <div>
      <PageHeader title="Coupons" action={<Button onClick={() => setForm(EMPTY_FORM)}>+ NEW COUPON</Button>} />

      {form && (
        <div style={{ ...cardStyle, marginBottom: 20 }}>
          <span style={labelStyle}>{form.id ? 'Edit Coupon' : 'New Coupon'}</span>
          {error && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 8 }}>{error}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 14, alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Code *</label>
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} style={inputStyle} required />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Discount % *</label>
              <input type="number" min="1" max="100" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} style={inputStyle} required />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Min Order ($)</label>
              <input type="number" min="0" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Max Uses</label>
              <input type="number" min="1" placeholder="Unlimited" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Expires *</label>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} style={inputStyle} required />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="submit" disabled={saving}>{saving ? 'SAVING…' : 'SAVE'}</Button>
              <Button variant="ghost" onClick={() => { setForm(null); setError('') }}>CANCEL</Button>
            </div>
          </form>
        </div>
      )}

      <div style={cardStyle}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}><Spinner size={32} /></div>
        ) : coupons.length === 0 ? (
          <EmptyState icon="🏷️" title="No coupons yet" message="Create your first coupon code." />
        ) : (
          <Table headers={[ 'Code', 'Discount', 'Min Order', 'Uses', 'Expires', 'Status', '' ]}>
            {coupons.map((c: any) => {
              const expired = new Date(c.expiresAt) < new Date()
              return (
                <tr key={c._id}>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{c.code}</td>
                  <td style={tdStyle}>{c.discountPercent}%</td>
                  <td style={tdStyle}>${c.minOrderAmount}</td>
                  <td style={tdStyle}>{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ''}</td>
                  <td style={tdStyle}>{new Date(c.expiresAt).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    {expired
                      ? <Badge text="Expired" color="var(--text-muted)" />
                      : c.isActive
                        ? <Badge text="Active" color="var(--success)" />
                        : <Badge text="Inactive" color="var(--gold)" />}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={() => toggleActive(c)} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer' }}>
                        {c.isActive ? 'DEACTIVATE' : 'ACTIVATE'}
                      </button>
                      <button onClick={() => setForm({ id: c._id, code: c.code, discountPercent: String(c.discountPercent), minOrderAmount: String(c.minOrderAmount), maxUses: c.maxUses ? String(c.maxUses) : '', expiresAt: c.expiresAt.slice(0, 10) })} style={{ background: 'transparent', border: 'none', color: 'var(--text-sub)', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer' }}>
                        EDIT
                      </button>
                      <button onClick={() => handleDelete(c._id, c.code)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer' }}>
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </Table>
        )}
      </div>
    </div>
  )
}
