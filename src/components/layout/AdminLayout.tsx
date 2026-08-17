import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import ErrorBoundary from '@/components/common/ErrorBoundary'

export default function AdminLayout() {
  return (
    <div
      className="container"
      style={{
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start',
        paddingTop: 28,
        paddingBottom: 60,
      }}
    >
      <AdminSidebar />
      <main style={{ flex: 1, minWidth: 0 }}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  )
}
