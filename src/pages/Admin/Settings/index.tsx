import { useState, useEffect } from 'react'
import Spinner from '@/components/common/Spinner'
import { PageHeader, cardStyle, labelStyle, inputStyle, Button } from '@/components/admin/AdminUI'
import { useGetSettingsQuery, useUpdateSettingsMutation } from '@/features/admin/adminSettingsApi'

const CURRENCIES = [ 'USD', 'EUR', 'GBP', 'BDT', 'INR' ]

export default function AdminSettings() {
  const { data, isLoading } = useGetSettingsQuery(undefined)
  const [ updateSettings, { isLoading: saving } ] = useUpdateSettingsMutation()

  const [ form, setForm ] = useState<any>(null)
  const [ status, setStatus ] = useState<'idle' | 'saved' | 'error'>('idle')
  const [ errorMsg, setErrorMsg ] = useState('')

  useEffect(() => {
    if (data?.data?.settings) setForm(data.data.settings)
  }, [ data ])

  if (isLoading || !form) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Spinner size={32} /></div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('idle')
    setErrorMsg('')
    try {
      await updateSettings({
        storeName: form.storeName,
        storeEmail: form.storeEmail,
        currency: form.currency,
        taxRate: Number(form.taxRate),
        shippingCost: Number(form.shippingCost),
        freeShippingMin: Number(form.freeShippingMin),
        isStoreOpen: form.isStoreOpen,
        maintenanceMessage: form.maintenanceMessage,
        socialLinks: form.socialLinks,
      }).unwrap()
      setStatus('saved')
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Failed to save settings')
      setStatus('error')
    }
  }

  return (
    <div>
      <PageHeader title="Store Settings" />

      {status === 'saved' && (
        <div style={{ background: 'var(--success)18', border: '1px solid var(--success)33', color: 'var(--success)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 13, marginBottom: 16 }}>
          Settings saved successfully.
        </div>
      )}
      {status === 'error' && (
        <div style={{ background: 'var(--danger)18', border: '1px solid var(--danger)33', color: 'var(--danger)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 13, marginBottom: 16 }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={cardStyle}>
          <span style={labelStyle}>Store Info</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Store Name</label>
              <input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Store Email</label>
              <input type="email" value={form.storeEmail} onChange={(e) => setForm({ ...form, storeEmail: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Currency</label>
              <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} style={inputStyle}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>
                <input type="checkbox" checked={form.isStoreOpen} onChange={(e) => setForm({ ...form, isStoreOpen: e.target.checked })} style={{ marginRight: 6 }} />
                Store is open
              </label>
            </div>
          </div>
          {!form.isStoreOpen && (
            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Maintenance Message</label>
              <textarea value={form.maintenanceMessage} onChange={(e) => setForm({ ...form, maintenanceMessage: e.target.value })} style={{ ...inputStyle, minHeight: 70 }} />
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <span style={labelStyle}>Pricing</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Tax Rate (0–1)</label>
              <input type="number" step="0.01" min="0" max="1" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Shipping Cost ($)</label>
              <input type="number" step="0.01" min="0" value={form.shippingCost} onChange={(e) => setForm({ ...form, shippingCost: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Free Shipping Min ($)</label>
              <input type="number" step="0.01" min="0" value={form.freeShippingMin} onChange={(e) => setForm({ ...form, freeShippingMin: e.target.value })} style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <span style={labelStyle}>Social Links</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
            {([ 'facebook', 'instagram', 'twitter', 'youtube' ] as const).map((key) => (
              <div key={key}>
                <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6, textTransform: 'capitalize' }}>{key}</label>
                <input
                  value={form.socialLinks?.[ key ] || ''}
                  onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, [ key ]: e.target.value } })}
                  style={inputStyle}
                  placeholder={`https://${key}.com/yourstore`}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <Button type="submit" disabled={saving}>{saving ? 'SAVING…' : 'SAVE SETTINGS'}</Button>
        </div>
      </form>
    </div>
  )
}
