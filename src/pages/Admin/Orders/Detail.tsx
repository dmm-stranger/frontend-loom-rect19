import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Spinner from '@/components/common/Spinner'
import { formatCurrency } from '@/utils/formatCurrency'
import { STATUS_COLORS } from '@/constants/adminStatus'
import { cardStyle, labelStyle, inputStyle, Button, Badge } from '@/components/admin/AdminUI'
import {
  useGetAdminOrderQuery,
  useUpdateOrderStatusMutation,
  useDeleteAdminOrderMutation,
} from '@/features/admin/adminOrdersApi'

const NEXT_STATUSES: Record<string, string[]> = {
  processing: [ 'processing', 'shipped', 'cancelled' ],
  shipped: [ 'shipped', 'delivered', 'cancelled' ],
  delivered: [ 'delivered' ],
  cancelled: [ 'cancelled' ],
}

export default function AdminOrderDetail() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useGetAdminOrderQuery(orderId!)
  const [ updateStatus, { isLoading: updating } ] = useUpdateOrderStatusMutation()
  const [ deleteOrder, { isLoading: deleting } ] = useDeleteAdminOrderMutation()
  const [ error, setError ] = useState('')

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Spinner size={32} /></div>
  }

  const order = data?.data?.order
  if (!order) return <p style={{ color: 'var(--text-muted)' }}>Order not found.</p>

  const color = STATUS_COLORS[ order.orderStatus ] || 'var(--text-muted)'
  const locked = order.orderStatus === 'delivered' || order.orderStatus === 'cancelled'
  const options = NEXT_STATUSES[ order.orderStatus ] || []

  const handleStatusChange = async (status: string) => {
    if (status === order.orderStatus) return
    setError('')
    try {
      await updateStatus({ id: order._id, status }).unwrap()
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (order.orderStatus !== 'cancelled') return
    if (!confirm('Delete this cancelled order permanently?')) return
    try {
      await deleteOrder(order._id).unwrap()
      navigate('/admin/orders')
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to delete order')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Link to="/admin/orders" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11, textDecoration: 'none' }}>← BACK TO ORDERS</Link>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 20, color: 'var(--text)', marginTop: 8 }}>
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
        </div>
        <Badge text={order.orderStatus} color={color} />
      </div>

      {error && (
        <div style={{ background: 'var(--danger)18', border: '1px solid var(--danger)33', color: 'var(--danger)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Items */}
        <div style={cardStyle}>
          <span style={labelStyle}>Items</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
            {order.items.map((item: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0 }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=?' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: 'var(--text)' }}>{item.name}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>Qty {item.qty} × {formatCurrency(item.price)}</p>
                </div>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{formatCurrency(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 14, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{formatCurrency(order.totalPrice)}</span>
          </div>
        </div>

        {/* Customer + Shipping */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={cardStyle}>
            <span style={labelStyle}>Customer</span>
            <p style={{ marginTop: 10, fontSize: 14 }}>{order.user?.name}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.user?.email}</p>
          </div>

          <div style={cardStyle}>
            <span style={labelStyle}>Shipping Address</span>
            <p style={{ marginTop: 10, fontSize: 13, lineHeight: 1.6 }}>
              {order.shippingAddress?.fullName}<br />
              {order.shippingAddress?.line1}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
              {order.shippingAddress?.country}
            </p>
          </div>

          <div style={cardStyle}>
            <span style={labelStyle}>Update Status</span>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <select
                value={order.orderStatus}
                disabled={locked || updating}
                onChange={(e) => handleStatusChange(e.target.value)}
                style={inputStyle}
              >
                {options.map((s) => (
                  <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              {locked && (
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {order.orderStatus === 'delivered' ? 'Delivered orders cannot be changed.' : 'Cancelled orders cannot be changed.'}
                </p>
              )}
            </div>
            {order.orderStatus === 'cancelled' && (
              <div style={{ marginTop: 12 }}>
                <Button variant="danger" disabled={deleting} onClick={handleDelete}>
                  {deleting ? 'DELETING…' : 'DELETE ORDER'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
