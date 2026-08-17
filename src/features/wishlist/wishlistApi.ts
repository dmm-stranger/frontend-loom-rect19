import { baseApi } from '@/app/api/baseApi'
import { setWishlist } from './wishlistSlice'

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/v1/wishlist
    getWishlist: builder.query({
      query: () => '/wishlist',
      providesTags: [ 'Wishlist' ],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Sync backend wishlist into Redux
          dispatch(setWishlist(data.data.productIds || []))
        } catch { }
      },
    }),

    // POST /api/v1/wishlist/:productId
    addToWishlist: builder.mutation({
      query: (productId: string) => ({
        url: `/wishlist/${productId}`,
        method: 'POST',
      }),
      invalidatesTags: [ 'Wishlist' ],
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setWishlist(data.data.productIds || []))
        } catch { }
      },
    }),

    // DELETE /api/v1/wishlist/:productId
    removeFromWishlist: builder.mutation({
      query: (productId: string) => ({
        url: `/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [ 'Wishlist' ],
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setWishlist(data.data.productIds || []))
        } catch { }
      },
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi