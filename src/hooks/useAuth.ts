// @ts-ignore
// @ts-nocheck


import { useSelector } from 'react-redux'
import { selectCurrentUser, selectIsAuth, selectAuthStatus } from '../features/auth/authSlice'
import { useLogoutUserMutation } from '../features/auth/authApi'

export function useAuth() {
  const user = useSelector(selectCurrentUser)
  const isAuth = useSelector(selectIsAuth)
  const status = useSelector(selectAuthStatus)
  const [ logoutUser ] = useLogoutUserMutation()

  return {
    user,
    isAuth,
    status,
    isLoading: status === 'loading',
    // Calls POST /auth/logout so the server clears its httpOnly cookie too —
    // dispatching the local `logout` reducer alone left the cookie alive,
    // which silently re-authenticated the user on the next page refresh.
    signOut: () => logoutUser(undefined),
  }
}