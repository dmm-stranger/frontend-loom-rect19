import { useState } from 'react'
import { useSelector } from 'react-redux'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { PageHeader, cardStyle, inputStyle, Table, tdStyle, Badge, Pagination } from '@/components/admin/AdminUI'
import { selectCurrentUser } from '@/features/auth/authSlice'
import {
  useGetAdminUsersQuery,
  useUpdateUserRoleMutation,
  useBanUserMutation,
  useDeleteAdminUserMutation,
} from '@/features/admin/adminUsersApi'
import { useDebounce } from '@/hooks/useDebounce'

export default function AdminUsers() {
  const currentUser = useSelector(selectCurrentUser)
  const [ page, setPage ] = useState(1)
  const [ role, setRole ] = useState('')
  const [ search, setSearch ] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading, isFetching } = useGetAdminUsersQuery({
    page, limit: 20, role: role || undefined, search: debouncedSearch || undefined,
  })
  const users = data?.data?.users || []
  const pagination = data?.data?.pagination || { page: 1, pages: 1 }

  const [ updateRole ] = useUpdateUserRoleMutation()
  const [ banUser ] = useBanUserMutation()
  const [ deleteUser, { isLoading: deleting } ] = useDeleteAdminUserMutation()

  const isSelf = (id: string) => id === currentUser?.id

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await updateRole({ id, role: newRole as 'customer' | 'admin' }).unwrap()
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to update role')
    }
  }

  const handleBanToggle = async (id: string, currentlyBanned: boolean) => {
    try {
      await banUser({ id, isBanned: !currentlyBanned }).unwrap()
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to update ban status')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete user "${name}"?`)) return
    try {
      await deleteUser(id).unwrap()
    } catch (err: any) {
      alert(err?.data?.message || 'Failed to delete user')
    }
  }

  return (
    <div>
      <PageHeader title="Users" />

      <div style={{ ...cardStyle, marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          style={{ ...inputStyle, flex: 1, minWidth: 200 }}
        />
        <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1) }} style={{ ...inputStyle, maxWidth: 180 }}>
          <option value="">All roles</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div style={cardStyle}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}><Spinner size={32} /></div>
        ) : users.length === 0 ? (
          <EmptyState icon="👥" title="No users found" message="Try a different search or filter." />
        ) : (
          <>
            {isFetching && <div style={{ marginBottom: 10 }}><Spinner size={18} /></div>}
            <Table headers={[ 'Name', 'Email', 'Role', 'Status', 'Joined', '' ]}>
              {users.map((u: any) => (
                <tr key={u._id}>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>
                    <select
                      value={u.role}
                      disabled={isSelf(u._id)}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      style={{ ...inputStyle, padding: '5px 8px', fontSize: 12, width: 'auto' }}
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={tdStyle}>
                    {u.isBanned
                      ? <Badge text="Banned" color="var(--danger)" />
                      : <Badge text="Active" color="var(--success)" />}
                  </td>
                  <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    {!isSelf(u._id) && u.role !== 'admin' && (
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button
                          onClick={() => handleBanToggle(u._id, u.isBanned)}
                          style={{ background: 'transparent', border: 'none', color: u.isBanned ? 'var(--success)' : 'var(--gold)', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer' }}
                        >
                          {u.isBanned ? 'UNBAN' : 'BAN'}
                        </button>
                        <button
                          onClick={() => handleDelete(u._id, u.name)}
                          disabled={deleting}
                          style={{ background: 'transparent', border: 'none', color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: 11, cursor: 'pointer' }}
                        >
                          DELETE
                        </button>
                      </div>
                    )}
                    {isSelf(u._id) && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>(you)</span>}
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
