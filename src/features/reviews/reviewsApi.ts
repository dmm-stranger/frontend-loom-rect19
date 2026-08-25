import { baseApi } from '@/app/api/baseApi'

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/v1/products/:productId/reviews
    getProductReviews: builder.query({
      query: (productId: string) => `/products/${productId}/reviews`,
      providesTags: (_result, _error, productId) => [
        { type: 'Review' as const, id: productId },
      ],
    }),

    // POST /api/v1/products/:productId/reviews  (create or update — one per user)
    submitReview: builder.mutation({
      query: ({ productId, rating, comment }: { productId: string; rating: number; comment: string }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        body: { rating, comment },
      }),
      // Also invalidate the product itself so ratingsAverage/ratingsCount
      // (shown on the product card and detail header) refresh too.
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Review' as const, id: productId },
        { type: 'Product' as const, id: productId },
      ],
    }),

    // DELETE /api/v1/products/:productId/reviews/:reviewId
    deleteReview: builder.mutation({
      query: ({ productId, reviewId }: { productId: string; reviewId: string }) => ({
        url: `/products/${productId}/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: 'Review' as const, id: productId },
        { type: 'Product' as const, id: productId },
      ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetProductReviewsQuery,
  useSubmitReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi
