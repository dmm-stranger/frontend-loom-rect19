import { baseApi } from '@/app/api/baseApi'

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/v1/cart
    getCart: builder.query({
      query: () => '/cart',
      providesTags: [ 'Cart' ],
    }),

    // POST /api/v1/cart/items
    addToCart: builder.mutation({
      query: (item) => ({
        url: '/cart/items',
        method: 'POST',
        body: item, // { productId, qty }
      }),
      invalidatesTags: [ 'Cart' ],
    }),

    // PATCH /api/v1/cart/items/:productId
    updateCartItem: builder.mutation({
      query: ({ productId, qty }) => ({
        url: `/cart/items/${productId}`,
        method: 'PATCH',
        body: { qty },
      }),
      invalidatesTags: [ 'Cart' ],
    }),

    // DELETE /api/v1/cart/items/:productId
    removeCartItem: builder.mutation({
      query: (productId) => ({
        url: `/cart/items/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [ 'Cart' ],
    }),

    // DELETE /api/v1/cart
    clearCart: builder.mutation({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: [ 'Cart' ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi