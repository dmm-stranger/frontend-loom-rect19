import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Spinner from '@/components/common/Spinner'
import { cardStyle, labelStyle, inputStyle, Button } from '@/components/admin/AdminUI'
import {
  useGetAdminProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/features/admin/adminProductsApi'
import { useGetCategoriesQuery } from '@/features/products/productsApi'

interface SpecRow { key: string; value: string }
interface ExistingImage { url: string; public_id: string }

export default function AdminProductForm() {
  const { productId } = useParams()
  const isEdit = !!productId
  const navigate = useNavigate()

  const { data: editData, isLoading: loadingProduct } = useGetAdminProductQuery(productId!, { skip: !isEdit })
  const { data: catData } = useGetCategoriesQuery({})
  const categories = catData?.data?.categories || []

  const [ createProduct, { isLoading: creating } ] = useCreateProductMutation()
  const [ updateProduct, { isLoading: updating } ] = useUpdateProductMutation()

  const [ name, setName ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ brand, setBrand ] = useState('')
  const [ category, setCategory ] = useState('')
  const [ price, setPrice ] = useState('')
  const [ discountPrice, setDiscountPrice ] = useState('')
  const [ stock, setStock ] = useState('')
  const [ isFeatured, setIsFeatured ] = useState(false)
  const [ specs, setSpecs ] = useState<SpecRow[]>([ { key: '', value: '' } ])
  const [ existingImages, setExistingImages ] = useState<ExistingImage[]>([])
  const [ removeImages, setRemoveImages ] = useState<string[]>([])
  const [ newImages, setNewImages ] = useState<File[]>([])
  const [ error, setError ] = useState('')

  useEffect(() => {
    const product = editData?.data?.product
    if (!product) return
    setName(product.name)
    setDescription(product.description)
    setBrand(product.brand)
    setCategory(product.category?._id || '')
    setPrice(String(product.price))
    setDiscountPrice(String(product.discountPrice || ''))
    setStock(String(product.stock))
    setIsFeatured(!!product.isFeatured)
    setExistingImages(product.images || [])
    const specEntries = Object.entries(product.specs || {})
    setSpecs(specEntries.length ? specEntries.map(([ key, value ]) => ({ key, value: String(value) })) : [ { key: '', value: '' } ])
  }, [ editData ])

  const totalImageCount = existingImages.length - removeImages.length + newImages.length

  const handleAddImages = (files: FileList | null) => {
    if (!files) return
    const arr = Array.from(files)
    if (totalImageCount + arr.length > 5) {
      setError('A product can have at most 5 images total.')
      return
    }
    setNewImages((prev) => [ ...prev, ...arr ])
  }

  const specsObject = () => {
    const obj: Record<string, string> = {}
    specs.forEach((s) => { if (s.key.trim()) obj[ s.key.trim() ] = s.value })
    return obj
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !description || !brand || !category || !price || !stock) {
      setError('Please fill in all required fields.')
      return
    }

    const payload = {
      name, description, brand, category,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: Number(stock),
      isFeatured,
      specs: specsObject(),
      images: newImages,
    }

    try {
      if (isEdit) {
        await updateProduct({ id: productId!, ...payload, removeImages }).unwrap()
      } else {
        await createProduct(payload).unwrap()
      }
      navigate('/admin/products')
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to save product')
    }
  }

  if (isEdit && loadingProduct) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Spinner size={32} /></div>
  }

  const saving = creating || updating

  return (
    <div>
      <Link to="/admin/products" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11, textDecoration: 'none' }}>← BACK TO PRODUCTS</Link>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 20, color: 'var(--text)', margin: '10px 0 20px' }}>
        {isEdit ? 'Edit Product' : 'New Product'}
      </h1>

      {error && (
        <div style={{ background: 'var(--danger)18', border: '1px solid var(--danger)33', color: 'var(--danger)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={cardStyle}>
          <span style={labelStyle}>Basic Info</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Brand *</label>
              <input value={brand} onChange={(e) => setBrand(e.target.value)} style={inputStyle} required />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle} required>
                <option value="">Select category</option>
                {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} style={{ marginRight: 6 }} />
                Featured product
              </label>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} required />
          </div>
        </div>

        <div style={cardStyle}>
          <span style={labelStyle}>Pricing & Stock</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Price ($) *</label>
              <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} required />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Discount Price ($)</label>
              <input type="number" min="0" step="0.01" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-sub)', display: 'block', marginBottom: 6 }}>Stock *</label>
              <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} style={inputStyle} required />
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={labelStyle}>Specs</span>
            <button type="button" onClick={() => setSpecs([ ...specs, { key: '', value: '' } ])} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer' }}>+ ADD SPEC</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
            {specs.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <input placeholder="e.g. RAM" value={s.key} onChange={(e) => setSpecs(specs.map((row, idx) => idx === i ? { ...row, key: e.target.value } : row))} style={{ ...inputStyle, flex: 1 }} />
                <input placeholder="e.g. 16GB" value={s.value} onChange={(e) => setSpecs(specs.map((row, idx) => idx === i ? { ...row, value: e.target.value } : row))} style={{ ...inputStyle, flex: 1 }} />
                <button type="button" onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 16 }}>✕</button>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <span style={labelStyle}>Images (max 5)</span>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
            {existingImages.filter((img) => !removeImages.includes(img.public_id)).map((img) => (
              <div key={img.public_id} style={{ position: 'relative', width: 72, height: 72 }}>
                <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
                <button
                  type="button"
                  onClick={() => setRemoveImages([ ...removeImages, img.public_id ])}
                  style={{ position: 'absolute', top: -6, right: -6, background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, fontSize: 11, cursor: 'pointer' }}
                >✕</button>
              </div>
            ))}
            {newImages.map((file, i) => (
              <div key={i} style={{ position: 'relative', width: 72, height: 72 }}>
                <img src={URL.createObjectURL(file)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-border)' }} />
                <button
                  type="button"
                  onClick={() => setNewImages(newImages.filter((_, idx) => idx !== i))}
                  style={{ position: 'absolute', top: -6, right: -6, background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, fontSize: 11, cursor: 'pointer' }}
                >✕</button>
              </div>
            ))}
            {totalImageCount < 5 && (
              <label style={{ width: 72, height: 72, border: '1px dashed var(--border-hi)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 22, color: 'var(--text-muted)' }}>
                +
                <input type="file" accept="image/*" multiple hidden onChange={(e) => handleAddImages(e.target.files)} />
              </label>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Button type="submit" disabled={saving}>{saving ? 'SAVING…' : isEdit ? 'SAVE CHANGES' : 'CREATE PRODUCT'}</Button>
          <Link to="/admin/products" style={{ textDecoration: 'none' }}><Button variant="ghost">CANCEL</Button></Link>
        </div>
      </form>
    </div>
  )
}
