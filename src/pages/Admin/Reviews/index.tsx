import { useState } from 'react'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { PageHeader, cardStyle, inputStyle, Pagination } from '@/components/admin/AdminUI'
import { useGetAdminReviewsQuery, useDeleteAdminReviewMutation } from '@/features/admin/adminReviewsApi'

export default function AdminReviews() {
  const [ page, setPage ] = useState(1)
  const [ rating, setRating ] = useState('')

  const { data, isLoading, isFetching } = useGetAdminReviewsQuery({ page, limit: 20, rating: rating || undefined })
  const reviews = data?.data?.reviews || []
  const pagination = data?.data?.pagination || { page: 1, pages: 1 }

  const [ deleteReview, { isLoading: deleting } ] = useDeleteAdminReviewMutation()

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return
    try {
      await deleteReview(id).unwrap()
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to delete review')
    }
  }

  return (
    <div>
      <PageHeader title="Reviews" />

      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <select value={rating} onChange={(e) => { setRating(e.target.value); setPage(1) }} style={{ ...inputStyle, maxWidth: 180 }}>
          <option value="">All ratings</option>
          {[ 5, 4, 3, 2, 1 ].map((r) => <option key={r} value={r}>{r} star{r > 1 ? 's' : ''}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}><Spinner size={32} /></div>
      ) : reviews.length === 0 ? (
        <div style={cardStyle}><EmptyState icon="⭐" title="No reviews found" message="Try a different rating filter." /></div>
      ) : (
        <>
          {isFetching && <div style={{ marginBottom: 10 }}><Spinner size={18} /></div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reviews.map((r: any) => (
              <div key={r._id} style={{ ...cardStyle, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0 }}>
                  <img src={r.product?.images?.[0]?.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80?text=?' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <p style={{ fontSize: 13, color: 'var(--text)' }}>{r.product?.name || 'Unknown product'}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>by {r.user?.name || 'Unknown'} · {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span style={{ color: 'var(--gold)', fontSize: 13 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  {r.comment && <p style={{ fontSize: 13, color: 'var(--text-sub)', marginTop: 8 }}>{r.comment}</p>}
                  <button
                    onClick={() => handleDelete(r._id)}
                    disabled={deleting}
                    style={{ background: 'transparent', border: 'none', color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer', marginTop: 10 }}
                  >
                    DELETE REVIEW
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
        </>
      )}
    </div>
  )
}
