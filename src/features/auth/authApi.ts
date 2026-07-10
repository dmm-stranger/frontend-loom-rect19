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
          dispatch(logout())
        } catch { }
      },
    }),

    // GET /api/v1/auth/me
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: [ 'User' ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutUserMutation,
  useGetMeQuery,
} = authApi