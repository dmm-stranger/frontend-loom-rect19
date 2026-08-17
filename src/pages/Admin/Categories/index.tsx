import { useState } from 'react'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { PageHeader, cardStyle, labelStyle, inputStyle, Button } from '@/components/admin/AdminUI'
import {
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '@/features/admin/adminCategoriesApi'

interface FormState { id?: string; name: string; parent: string; image: File | null; currentImageUrl?: string }

const EMPTY_FORM: FormState = { name: '', parent: '', image: null }

export default function AdminCategories() {
  const { data, isLoading } = useGetAdminCategoriesQuery({})
  const categories = data?.data?.categories || []

  const [ createCategory, { isLoading: creating } ] = useCreateCategoryMutation()
  const [ updateCategory, { isLoading: updating } ] = useUpdateCategoryMutation()
  const [ deleteCategory ] = useDeleteCategoryMutation()

  const [ form, setForm ] = useState<FormState | null>(null)
  const [ error, setError ] = useState('')

  const saving = creating || updating

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form?.name.trim()) { setError('Category name is required.'); return }
    setError('')
    try {
      if (form.id) {
        await updateCategory({ id: form.id, name: form.name, parent: form.parent || null, image: form.image }).unwrap()
      } else {
        await createCategory({ name: form.name, parent: form.parent || null, image: form.image }).unwrap()
      }
      setForm(null)
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to save category')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Products in this category will keep their reference but the category record will be gone.`)) return
    try {
      await deleteCategory(id).unwrap()
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to delete category')
    }
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        action={<Button onClick={() => setForm(EMPTY_FORM)}>+ NEW CATEGORY</Button>}
      />

      {form && (
        <div style={{ ...cardStyle, marginBottom: 20 }}>
          <span style={labelStyle}>{form.id ? 'Edit Category' : 'New Category'}</span>
          {error && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 8 }}>{error}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap', marginTop: 14 }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} required />
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Parent Category (optional)</label>
              <select value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })} style={inputStyle}>
                <option value="">None (top-level)</option>
                {categories.filter((c: any) => c._id !== form.id).map((c: any) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Image</label>
              <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })} style={{ fontSize: 12, color: 'var(--text-sub)' }} />
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
        ) : categories.length === 0 ? (
          <EmptyState icon="🗂️" title="No categories yet" message="Create your first category to organize products." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {categories.map((c: any) => (
              <div key={c._id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0, background: 'var(--bg-elevated)' }}>
                  {c.image?.url && <img src={c.image.url} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button onClick={() => setForm({ id: c._id, name: c.name, parent: c.parent || '', image: null })} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 10, cursor: 'pointer' }}>EDIT</button>
                    <button onClick={() => handleDelete(c._id, c.name)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: 10, cursor: 'pointer' }}>DELETE</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
