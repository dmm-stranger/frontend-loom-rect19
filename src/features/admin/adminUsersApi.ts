import { baseApi } from '@/app/api/baseApi'

export const adminUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/v1/admin/users?page=&limit=&role=&search=
    getAdminUsers: builder.query({
      query: (params: any = {}) => ({
        url: '/admin/users',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          role: params.role || undefined,
          search: params.search || undefined,
        },
      }),
      providesTags: (result) =>
        result?.data?.users
          ? [
            ...result.data.users.map(({ _id }: any) => ({ type: 'User' as const, id: _id })),
            { type: 'User' as const, id: 'ADMIN_LIST' },
          ]
          : [ { type: 'User' as const, id: 'ADMIN_LIST' } ],
    }),

    // GET /api/v1/admin/users/:id → { user, orders, stats }
    getAdminUser: builder.query({
      query: (id: string) => `/admin/users/${id}`,
      providesTags: (_result, _error, id) => [ { type: 'User', id } ],
    }),

    // PATCH /api/v1/admin/users/:id/role
    updateUserRole: builder.mutation({
      query: ({ id, role }: { id: string; role: 'customer' | 'admin' }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id }, { type: 'User', id: 'ADMIN_LIST' },
      ],
    }),

    // PATCH /api/v1/admin/users/:id/ban
    banUser: builder.mutation({
      query: ({ id, isBanned }: { id: string; isBanned: boolean }) => ({
        url: `/admin/users/${id}/ban`,
        method: 'PATCH',
        body: { isBanned },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id }, { type: 'User', id: 'ADMIN_LIST' },
      ],
    }),

    // DELETE /api/v1/admin/users/:id
    deleteAdminUser: builder.mutation({
      query: (id: string) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [ { type: 'User', id: 'ADMIN_LIST' } ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetAdminUsersQuery,
  useGetAdminUserQuery,
  useUpdateUserRoleMutation,
  useBanUserMutation,
  useDeleteAdminUserMutation,
} = adminUsersApi
