// @ts-ignore
// @ts-nocheck


import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
  email: string
  avatar: string
}

interface AuthState {
  user: User | null
  token: string | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
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
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
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

export default authSlice.reducer