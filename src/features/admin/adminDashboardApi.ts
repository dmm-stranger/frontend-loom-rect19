import { baseApi } from '@/app/api/baseApi'

export const adminDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/v1/admin/dashboard/stats
    // Returns: totalRevenue, totalOrders, totalUsers, totalProducts,
    //          ordersByStatus, revenueByMonth, topProducts, recentOrders
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard/stats',
      providesTags: [ 'Order', 'Product', 'User' ],
    }),

    // GET /api/v1/admin/dashboard/top-customers?limit=5
    getTopCustomers: builder.query({
      query: (limit: number = 5) => ({
        url: '/admin/dashboard/top-customers',
        params: { limit },
      }),
      providesTags: [ 'User' ],
    }),

    // GET /api/v1/admin/dashboard/sales-by-category
    getSalesByCategory: builder.query({
      query: () => '/admin/dashboard/sales-by-category',
      providesTags: [ 'Order', 'Category' ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetDashboardStatsQuery,
  useGetTopCustomersQuery,
  useGetSalesByCategoryQuery,
} = adminDashboardApi
