// @ts-ignore
// @ts-nocheck


import { useSelector, useDispatch } from 'react-redux'
import { logout, selectCurrentUser, selectIsAuth, selectAuthStatus } from '../features/auth/authSlice'
import type { AppDispatch } from '../app/store'

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector(selectCurrentUser)
  const isAuth = useSelector(selectIsAuth)
  const status = useSelector(selectAuthStatus)

  return {
    user,
    isAuth,
    status,
    isLoading: status === 'loading',
    signOut: () => dispatch(logout()),
  }
}