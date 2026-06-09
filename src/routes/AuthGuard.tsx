import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuth } from '@/features/auth/authSlice'
import { ROUTES } from '@/constants/routes'

export default function AuthGuard() {
  const isAuth = useSelector(selectIsAuth)
  const location = useLocation()

  if (!isAuth) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    )
  }

  return <Outlet />
}