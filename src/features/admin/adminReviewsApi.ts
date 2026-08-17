import { baseApi } from '@/app/api/baseApi'

export const adminReviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/v1/admin/reviews?page=&limit=&rating=&product=
    getAdminReviews: builder.query({
      query: (params: any = {}) => ({
        url: '/admin/reviews',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          rating: params.rating || undefined,
          product: params.product || undefined,
        },
      }),
      providesTags: (result) =>
        result?.data?.reviews
          ? [
            ...result.data.reviews.map(({ _id }: any) => ({ type: 'Review' as const, id: _id })),
            { type: 'Review' as const, id: 'ADMIN_LIST' },
          ]
          : [ { type: 'Review' as const, id: 'ADMIN_LIST' } ],
    }),

    // DELETE /api/v1/admin/reviews/:id (any review, not just own)
    deleteAdminReview: builder.mutation({
      query: (id: string) => ({
        url: `/admin/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [ { type: 'Review', id: 'ADMIN_LIST' } ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetAdminReviewsQuery,
  useDeleteAdminReviewMutation,
} = adminReviewsApi
