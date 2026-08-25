import { Link } from 'react-router-dom'
import Spinner from '@/components/common/Spinner'
import { formatCurrency } from '@/utils/formatCurrency'
import { STATUS_COLORS } from '@/constants/adminStatus'
import {
  useGetDashboardStatsQuery,
  useGetTopCustomersQuery,
  useGetSalesByCategoryQuery,
} from '@/features/admin/adminDashboardApi'

const card: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: 20,
}

const label: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  color: 'var(--text-muted)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
}

function StatCard({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <div style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={label}>{title}</span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 26, color: 'var(--text)', marginTop: 10 }}>
        {value}
      </p>
    </div>
  )
}

export default function AdminDashboard() {
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery(undefined)
  const { data: customersData, isLoading: customersLoading } = useGetTopCustomersQuery(5)
  const { data: categoryData, isLoading: categoryLoading } = useGetSalesByCategoryQuery(undefined)

  const stats = statsData?.data
  const topCustomers = customersData?.data?.topCustomers || []
  const salesByCategory = categoryData?.data?.salesByCategory || []

  if (statsLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <Spinner size={36} />
      </div>
    )
  }

  const maxMonthRevenue = Math.max(1, ...(stats?.revenueByMonth || []).map((m: any) => m.revenue))
  const maxCategoryRevenue = Math.max(1, ...salesByCategory.map((c: any) => c.revenue))
  const totalStatusCount = Object.values(stats?.ordersByStatus || {}).reduce(
    (a: number, b: any) => a + b, 0
  ) as number

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 22, color: 'var(--text)' }}>
        Dashboard
      </h1>

      {/* ── Top stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <StatCard icon="💰" title="Total Revenue" value={formatCurrency(stats?.totalRevenue || 0)} />
        <StatCard icon="📦" title="Total Orders" value={String(stats?.totalOrders ?? 0)} />
        <StatCard icon="👥" title="Total Users" value={String(stats?.totalUsers ?? 0)} />
        <StatCard icon="🖥️" title="Total Products" value={String(stats?.totalProducts ?? 0)} />
      </div>

      <div className="stack-on-mobile" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* ── Revenue by month bar chart ── */}
        <div style={card}>
          <span style={label}>Revenue — Last 6 Months</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160, marginTop: 20 }}>
            {(stats?.revenueByMonth || []).length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 'auto' }}>No paid orders yet</p>
            )}
            {(stats?.revenueByMonth || []).map((m: any) => (
              <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-sub)' }}>
                  {formatCurrency(m.revenue)}
                </span>
                <div
                  style={{
                    width: '100%',
                    maxWidth: 40,
                    height: Math.max(4, (m.revenue / maxMonthRevenue) * 110),
                    background: 'var(--accent)',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                  {m.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Orders by status ── */}
        <div style={card}>
          <span style={label}>Orders by Status</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            {Object.entries(stats?.ordersByStatus || {}).map(([ status, count ]: [ string, any ]) => {
              const pct = totalStatusCount > 0 ? (count / totalStatusCount) * 100 : 0
              const color = STATUS_COLORS[ status ] || 'var(--text-muted)'
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-sub)', textTransform: 'capitalize' }}>{status}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>{count}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* ── Top products ── */}
        <div style={card}>
          <span style={label}>Top Products</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            {(stats?.topProducts || []).length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No sales yet</p>
            )}
            {(stats?.topProducts || []).map((p: any) => (
              <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80?text=?' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{p.totalSold} sold · {formatCurrency(p.totalRevenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Top customers ── */}
        <div style={card}>
          <span style={label}>Top Customers · by Orders</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            {customersLoading && <Spinner size={24} />}
            {!customersLoading && topCustomers.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No orders yet</p>
            )}
            {topCustomers.map((c: any) => (
              <div key={c.userId} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                  {c.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{c.email}</p>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)' }}>{c.ordersCount} orders</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sales by category ── */}
      <div style={card}>
        <span style={label}>Sales by Category</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {categoryLoading && <Spinner size={24} />}
          {!categoryLoading && salesByCategory.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No paid orders yet</p>
          )}
          {salesByCategory.map((c: any) => (
            <div key={c.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--text-sub)' }}>{c.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>
                  {formatCurrency(c.revenue)} · {c.unitsSold} units
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                <div style={{ width: `${(c.revenue / maxCategoryRevenue) * 100}%`, height: '100%', background: 'var(--accent)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent orders ── */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={label}>Recent Orders</span>
          <Link to="/admin/orders" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', textDecoration: 'none' }}>
            VIEW ALL →
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(stats?.recentOrders || []).length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No orders yet</p>
          )}
          {(stats?.recentOrders || []).map((o: any) => {
            const color = STATUS_COLORS[ o.orderStatus ] || 'var(--text-muted)'
            return (
              <Link
                key={o._id}
                to={`/admin/orders/${o._id}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: 'var(--radius-sm)', textDecoration: 'none',
                  border: '1px solid var(--border)', gap: 12, flexWrap: 'wrap',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                  #{o._id.slice(-8).toUpperCase()}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-sub)', flex: 1, minWidth: 100 }}>
                  {o.user?.name || 'Unknown'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4, color, background: `${color}18`, border: `1px solid ${color}33` }}>
                  {o.orderStatus}
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
                  {formatCurrency(o.totalPrice)}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
