import { baseApi } from '@/app/api/baseApi'

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/v1/products?page=1&limit=12&sort=featured&category=gpus
    getProducts: builder.query({
      query: (params: any = {}) => ({
        url: '/products',
        params: {
          page: params.page || 1,
          limit: params.perPage || 12,
          sort: params.sortBy || 'featured',
          category: params.categorySlug || undefined,
          brand: params.brands?.join(',') || undefined,
          search: params.search || undefined,
          minPrice: params.minPrice || undefined,
          maxPrice: params.maxPrice || undefined,
          rating: params.rating || undefined,
        },
      }),
      providesTags: (result) =>
        result?.data?.products
          ? [
            ...result.data.products.map(({ _id }: any) => ({ type: 'Product' as const, id: _id })),
            { type: 'Product' as const, id: 'LIST' },
          ]
          : [ { type: 'Product' as const, id: 'LIST' } ],
    }),

    // GET /api/v1/products/featured
    getFeaturedProducts: builder.query({
      query: () => '/products/featured',
      providesTags: [ { type: 'Product', id: 'FEATURED' } ],
    }),


    // Works with both slug and _id
    getProductById: builder.query({
      query: (slugOrId: string) => `/products/${slugOrId}`,
      providesTags: (result, error, slugOrId) => [ { type: 'Product', id: slugOrId } ],
    }),

    // GET /api/v1/categories
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: [ 'Category' ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetProductsQuery,
  useGetFeaturedProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
} = productsApi