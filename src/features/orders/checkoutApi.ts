import { baseApi } from '@/app/api/baseApi'

export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // POST /api/v1/orders
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: [ 'Order', 'Cart' ],
    }),

    // POST /api/v1/payments/create-payment-intent
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: '/payments/create-payment-intent',
        method: 'POST',
        body: data, // { orderId }
      }),
    }),

    // POST /api/v1/orders/:id/pay
    payOrder: builder.mutation({
      query: ({ orderId, paymentResult }) => ({
        url: `/orders/${orderId}/pay`,
        method: 'POST',
        body: paymentResult,
      }),
      invalidatesTags: [ 'Order' ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useCreateOrderMutation,
  useCreatePaymentIntentMutation,
  usePayOrderMutation,
} = checkoutApi