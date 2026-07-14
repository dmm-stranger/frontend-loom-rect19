import { baseApi } from '@/app/api/baseApi'

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/v1/orders/my
    getMyOrders: builder.query({
      query: () => '/orders/my',
      providesTags: [ 'Order' ],
    }),

    // GET /api/v1/orders/:id
    getOrderById: builder.query({
      query: (id: string) => `/orders/${id}`,
      providesTags: (result, error, id) => [ { type: 'Order', id } ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
} = ordersApi