// @ts-ignore
// @ts-nocheck


import { baseApi } from '../../app/api/baseApi'
import { setCredentials, logout } from '../auth/authSlice'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials({ user: data.user, token: data.token }))
        } catch { }
      },
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    logoutUser: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(logout())
        } catch { }
      },
    }),

  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutUserMutation,
} = authApi