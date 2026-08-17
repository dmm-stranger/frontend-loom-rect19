import { useState } from 'react'
import { Link } from 'react-router-dom'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { formatCurrency } from '@/utils/formatCurrency'
import { STATUS_COLORS } from '@/constants/adminStatus'
import { PageHeader, cardStyle, inputStyle, Table, tdStyle, Badge, Pagination } from '@/components/admin/AdminUI'
import { useGetAdminOrdersQuery } from '@/features/admin/adminOrdersApi'

const STATUSES = [ '', 'processing', 'shipped', 'delivered', 'cancelled' ]

export default function AdminOrdersList() {
  const [ page, setPage ] = useState(1)
  const [ status, setStatus ] = useState('')

  const { data, isLoading, isFetching } = useGetAdminOrdersQuery({ page, limit: 20, status: status || undefined })
  const orders = data?.data?.orders || []
  const pagination = data?.data?.pagination || { page: 1, pages: 1 }

  return (
    <div>
      <PageHeader title="Orders" />

      <div style={{ ...cardStyle, marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          style={{ ...inputStyle, maxWidth: 200 }}
        >
          <option value="">All statuses</option>
          {STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div style={cardStyle}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}><Spinner size={32} /></div>
        ) : orders.length === 0 ? (
          <EmptyState icon="📦" title="No orders found" message="Try a different status filter." />
        ) : (
          <>
            {isFetching && <div style={{ marginBottom: 10 }}><Spinner size={18} /></div>}
            <Table headers={[ 'Order', 'Customer', 'Date', 'Status', 'Payment', 'Total', '' ]}>
              {orders.map((o: any) => {
                const color = STATUS_COLORS[ o.orderStatus ] || 'var(--text-muted)'
                return (
                  <tr key={o._id}>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>#{o._id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td style={tdStyle}>
                      <div>{o.user?.name || 'Unknown'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.user?.email}</div>
                    </td>
                    <td style={tdStyle}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td style={tdStyle}><Badge text={o.orderStatus} color={color} /></td>
                    <td style={tdStyle}>
                      <Badge
                        text={o.paymentInfo?.status || 'pending'}
                        color={o.paymentInfo?.status === 'paid' ? 'var(--success)' : 'var(--text-muted)'}
                      />
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{formatCurrency(o.totalPrice)}</td>
                    <td style={tdStyle}>
                      <Link to={`/admin/orders/${o._id}`} style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11, textDecoration: 'none' }}>
                        VIEW →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </Table>
            <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
