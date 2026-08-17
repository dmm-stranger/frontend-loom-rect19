import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'customer' | 'admin'
}

interface AuthState {
  user: User | null
  token: string | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

// Restore token from localStorage on app load
const savedToken = localStorage.getItem('loom_token')

const initialState: AuthState = {
  user: null,
  token: savedToken || null,
  status: savedToken ? 'succeeded' : 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.status = 'succeeded'
      state.error = null
      // Save token to localStorage so it persists on refresh
      localStorage.setItem('loom_token', action.payload.token)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
      // Remove token from localStorage on logout
      localStorage.removeItem('loom_token')
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.status = 'failed'
    },
  },
})

export const { setCredentials, logout, setAuthError } = authSlice.actions

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user
export const selectToken = (state: { auth: AuthState }) => state.auth.token
export const selectIsAuth = (state: { auth: AuthState }) => !!state.auth.token
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status
// True only once the user object has loaded AND role === 'admin'.
// Deliberately does NOT fall back to "token exists" — a customer token
// must never be treated as admin just because the user hasn't loaded yet.
export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.user?.role === 'admin'

export default authSlice.reducer