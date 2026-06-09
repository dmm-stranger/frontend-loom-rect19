// @ts-ignore
// @ts-nocheck


import { baseApi } from '../../app/api/baseApi'

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getProducts: builder.query({
      query: (params: any = {}) => ({
        url: '/products',
        params: {
          page: params.page || 1,
          limit: params.perPage || 12,
          sort: params.sortBy || 'featured',
          category: params.categorySlug || undefined,
          search: params.search || undefined,
        },
      }),
      providesTags: [ { type: 'Product', id: 'LIST' } ],
    }),

    getFeaturedProducts: builder.query({
      query: () => '/products/featured',
      providesTags: [ { type: 'Product', id: 'FEATURED' } ],
    }),

    getProductById: builder.query({
      query: (id: string) => `/products/${id}`,
      providesTags: (result, error, id) => [ { type: 'Product', id } ],
    }),

    getCategories: builder.query({
      query: () => '/categories',
      providesTags: [ 'Product' ],
    }),

  }),
})

export const {
  useGetProductsQuery,
  useGetFeaturedProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
} = productsApi