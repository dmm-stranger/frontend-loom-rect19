import { baseApi } from '@/app/api/baseApi'

export const adminOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/v1/admin/orders?page=&limit=&status=&paymentStatus=
    getAdminOrders: builder.query({
      query: (params: any = {}) => ({
        url: '/admin/orders',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          status: params.status || undefined,
          paymentStatus: params.paymentStatus || undefined,
        },
      }),
      providesTags: (result) =>
        result?.data?.orders
          ? [
            ...result.data.orders.map(({ _id }: any) => ({ type: 'Order' as const, id: _id })),
            { type: 'Order' as const, id: 'ADMIN_LIST' },
          ]
          : [ { type: 'Order' as const, id: 'ADMIN_LIST' } ],
    }),

    // GET /api/v1/admin/orders/:id
    getAdminOrder: builder.query({
      query: (id: string) => `/admin/orders/${id}`,
      providesTags: (_result, _error, id) => [ { type: 'Order', id } ],
    }),

    // PATCH /api/v1/admin/orders/:id/status
    updateOrderStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id }, { type: 'Order', id: 'ADMIN_LIST' },
      ],
    }),

    // NOTE: POST /admin/orders/:id/refund is listed in the spec but does not
    // exist on the backend (no route, no controller). Omitted here to avoid
    // shipping a button that would 404. Flagged for the final review.

    // DELETE /api/v1/admin/orders/:id (cancelled orders only)
    deleteAdminOrder: builder.mutation({
      query: (id: string) => ({
        url: `/admin/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [ { type: 'Order', id: 'ADMIN_LIST' } ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetAdminOrdersQuery,
  useGetAdminOrderQuery,
  useUpdateOrderStatusMutation,
  useDeleteAdminOrderMutation,
} = adminOrdersApi
