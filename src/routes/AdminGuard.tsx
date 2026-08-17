import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuth, selectIsAdmin, selectToken } from '@/features/auth/authSlice'
import { useGetMeQuery } from '@/features/auth/authApi'
import { ROUTES } from '@/constants/routes'
import Spinner from '@/components/common/Spinner'

/**
 * Protects /admin/* routes.
 *
 * Two checks, in order:
 *   1. Must be logged in at all (same as AuthGuard) → else -> /auth/login
 *   2. Must have role === 'admin' → else -> / (home)
 *
 * Why it calls useGetMeQuery itself:
 * On a hard refresh, App.tsx's getMe call may not have resolved yet, so
 * `user` (and therefore role) can briefly be null even for a real admin
 * with a valid token. RTK Query dedupes this call against the one in
 * App.tsx (same cache key), so this doesn't trigger a second network
 * request — it just lets this guard wait for the same in-flight result
 * instead of redirecting a legitimate admin before their role loads.
 */
export default function AdminGuard() {
  const isAuth = useSelector(selectIsAuth)
  const isAdmin = useSelector(selectIsAdmin)
  const token = useSelector(selectToken)
  const location = useLocation()

  const { isLoading, isFetching } = useGetMeQuery(undefined, { skip: !token })

  if (!isAuth) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  // Still resolving who this user is — don't redirect yet.
  if (!isAdmin && (isLoading || isFetching)) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <Outlet />
}
