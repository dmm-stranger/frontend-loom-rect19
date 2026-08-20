import { useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Spinner from '@/components/common/Spinner'
import { formatCurrency } from '@/utils/formatCurrency'
import { STATUS_COLORS } from '@/constants/adminStatus'
import { cardStyle, labelStyle, Badge, Button } from '@/components/admin/AdminUI'
import { selectCurrentUser } from '@/features/auth/authSlice'
import {
  useGetAdminUserQuery,
  useUpdateUserRoleMutation,
  useBanUserMutation,
  useDeleteAdminUserMutation,
} from '@/features/admin/adminUsersApi'

export default function AdminUserDetail() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)

  const { data, isLoading } = useGetAdminUserQuery(userId!)
  const [ updateRole, { isLoading: changingRole } ] = useUpdateUserRoleMutation()
  const [ banUser, { isLoading: banning } ] = useBanUserMutation()
  const [ deleteUser, { isLoading: deleting } ] = useDeleteAdminUserMutation()

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Spinner size={32} /></div>
  }

  const user = data?.data?.user
  const orders = data?.data?.orders || []
  const stats = data?.data?.stats

  if (!user) return <p style={{ color: 'var(--text-muted)' }}>User not found.</p>

  const isSelf = user._id === currentUser?.id
  const isAdminUser = user.role === 'admin'

  const handleRoleChange = async (role: string) => {
    try {
      await updateRole({ id: user._id, role: role as 'customer' | 'admin' }).unwrap()
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to update role')
    }
  }

  const handleBanToggle = async () => {
    try {
      await banUser({ id: user._id, isBanned: !user.isBanned }).unwrap()
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to update ban status')
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Permanently delete "${user.name}"? This cannot be undone.`)) return
    try {
      await deleteUser(user._id).unwrap()
      navigate('/admin/users')
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to delete user')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <Link to="/admin/users" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11, textDecoration: 'none' }}>← BACK TO USERS</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
            {user.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 20, color: 'var(--text)' }}>{user.name}</h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Order history */}
        <div style={cardStyle}>
          <span style={labelStyle}>Order History</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
            {orders.length === 0 && <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No orders yet.</p>}
            {orders.map((o: any) => {
              const color = STATUS_COLORS[ o.orderStatus ] || 'var(--text-muted)'
              return (
                <Link
                  key={o._id}
                  to={`/admin/orders/${o._id}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
                    padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', textDecoration: 'none',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                    #{o._id.slice(-8).toUpperCase()}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-sub)' }}>
                    {new Date(o.createdAt).toLocaleDateString()} · {o.items?.length || 0} item{o.items?.length === 1 ? '' : 's'}
                  </span>
                  <Badge text={o.orderStatus} color={color} />
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{formatCurrency(o.totalPrice)}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Stats + Account actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={cardStyle}>
            <span style={labelStyle}>Lifetime Stats</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: 'var(--text)' }}>{stats?.totalOrders ?? 0}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Orders</p>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: 'var(--accent)' }}>{formatCurrency(stats?.totalSpent || 0)}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total Spent</p>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <span style={labelStyle}>Account</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-sub)' }}>Role</span>
                <Badge text={user.role} color={user.role === 'admin' ? 'var(--accent)' : 'var(--text-muted)'} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-sub)' }}>Status</span>
                <Badge text={user.isBanned ? 'Banned' : 'Active'} color={user.isBanned ? 'var(--danger)' : 'var(--success)'} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-sub)' }}>Joined</span>
                <span style={{ fontSize: 12, color: 'var(--text)' }}>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {isSelf ? (
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 16 }}>This is your own account — role, ban, and delete actions are disabled for safety.</p>
            ) : isAdminUser ? (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Admin accounts can't be banned or deleted. Demote to customer first.</p>
                <Button variant="ghost" disabled={changingRole} onClick={() => handleRoleChange('customer')}>
                  {changingRole ? 'UPDATING…' : 'DEMOTE TO CUSTOMER'}
                </Button>
              </div>
            ) : (
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Button variant="ghost" disabled={changingRole} onClick={() => handleRoleChange('admin')}>
                  {changingRole ? 'UPDATING…' : 'PROMOTE TO ADMIN'}
                </Button>
                <Button variant="ghost" disabled={banning} onClick={handleBanToggle}>
                  {banning ? 'UPDATING…' : user.isBanned ? 'UNBAN USER' : 'BAN USER'}
                </Button>
                <Button variant="danger" disabled={deleting} onClick={handleDelete}>
                  {deleting ? 'DELETING…' : 'DELETE USER'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
