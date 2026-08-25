import { baseApi } from '@/app/api/baseApi'
import { setCredentials, logout } from './authSlice'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // POST /api/v1/auth/register
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData, // { name, email, password }
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Backend returns: { success, data: { user, token } }
          dispatch(setCredentials({
            user: data.data.user,
            token: data.data.token,
          }))
        } catch { }
      },
    }),

    // POST /api/v1/auth/login
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials, // { email, password }
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Backend returns: { success, data: { user, token } }
          dispatch(setCredentials({
            user: data.data.user,
            token: data.data.token,
          }))
        } catch { }
      },
    }),

    // POST /api/v1/auth/logout
    logoutUser: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } catch {
          // Even if the network call fails, clear the local session so the
          // user isn't stuck "logged in" on this device. The httpOnly cookie
          // may persist on the server until it naturally expires, but the
          // client no longer treats itself as authenticated.
        } finally {
          dispatch(logout())
        }
      },
    }),

    // GET /api/v1/auth/me
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: [ 'User' ],
    }),

    // POST /api/v1/auth/forgot-password
    forgotPassword: builder.mutation({
      query: (email: string) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),

    // PATCH /api/v1/auth/reset-password/:token
    resetPassword: builder.mutation({
      query: ({ token, password }: { token: string; password: string }) => ({
        url: `/auth/reset-password/${token}`,
        method: 'PATCH',
        body: { password },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Reset also logs the user in, same shape as login/register
          dispatch(setCredentials({ user: data.data.user, token: data.data.token }))
        } catch { }
      },
    }),

    // PATCH /api/v1/auth/change-password
    changePassword: builder.mutation({
      query: (body: { currentPassword: string; newPassword: string }) => ({
        url: '/auth/change-password',
        method: 'PATCH',
        body,
      }),
    }),

  }),
  overrideExisting: false,
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutUserMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi