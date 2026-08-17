import { baseApi } from '@/app/api/baseApi'

export const adminCouponsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/v1/admin/coupons?page=&limit=&isActive=
    getAdminCoupons: builder.query({
      query: (params: any = {}) => ({
        url: '/admin/coupons',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          isActive: params.isActive,
        },
      }),
      providesTags: (result) =>
        result?.data?.coupons
          ? [
            ...result.data.coupons.map(({ _id }: any) => ({ type: 'Coupon' as const, id: _id })),
            { type: 'Coupon' as const, id: 'LIST' },
          ]
          : [ { type: 'Coupon' as const, id: 'LIST' } ],
    }),

    // POST /api/v1/admin/coupons
    createCoupon: builder.mutation({
      query: (coupon: any) => ({
        url: '/admin/coupons',
        method: 'POST',
        body: coupon, // { code, discountPercent, minOrderAmount, maxUses, expiresAt }
      }),
      invalidatesTags: [ { type: 'Coupon', id: 'LIST' } ],
    }),

    // PATCH /api/v1/admin/coupons/:id — partial update
    updateCoupon: builder.mutation({
      query: ({ id, ...patch }: any) => ({
        url: `/admin/coupons/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: [ { type: 'Coupon', id: 'LIST' } ],
    }),

    // DELETE /api/v1/admin/coupons/:id
    deleteCoupon: builder.mutation({
      query: (id: string) => ({
        url: `/admin/coupons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [ { type: 'Coupon', id: 'LIST' } ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetAdminCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = adminCouponsApi
