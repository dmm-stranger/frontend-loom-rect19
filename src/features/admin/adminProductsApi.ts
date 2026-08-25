import { baseApi } from '@/app/api/baseApi'

// Builds a multipart/form-data body matching the backend's expectations:
//   images        → File[] under the "images" field (multer.array, max 5)
//   specs         → JSON string (backend does JSON.parse(specs))
//   removeImages  → JSON string array of public_ids to delete (update only)
//   isFeatured    → "true"/"false" string (backend checks === "true")
function buildProductFormData(product: {
  name: string
  description: string
  brand: string
  category: string
  price: number | string
  discountPrice?: number | string
  stock: number | string
  isFeatured?: boolean
  specs?: Record<string, string>
  images?: File[]
  removeImages?: string[]
}) {
  const fd = new FormData()
  fd.append('name', product.name)
  fd.append('description', product.description)
  fd.append('brand', product.brand)
  fd.append('category', product.category)
  fd.append('price', String(product.price))
  fd.append('discountPrice', String(product.discountPrice ?? 0))
  fd.append('stock', String(product.stock))
  fd.append('isFeatured', String(!!product.isFeatured))
  fd.append('specs', JSON.stringify(product.specs || {}))
  if (product.removeImages?.length) {
    fd.append('removeImages', JSON.stringify(product.removeImages))
  }
  ;(product.images || []).forEach((file) => fd.append('images', file))
  return fd
}

export const adminProductsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/v1/admin/products?page=&limit=&search=&category=&stock=
    getAdminProducts: builder.query({
      query: (params: any = {}) => ({
        url: '/admin/products',
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          search: params.search || undefined,
          category: params.category || undefined,
          stock: params.stock || undefined,
        },
      }),
      providesTags: (result) =>
        result?.data?.products
          ? [
            ...result.data.products.map(({ _id }: any) => ({ type: 'Product' as const, id: _id })),
            { type: 'Product' as const, id: 'ADMIN_LIST' },
          ]
          : [ { type: 'Product' as const, id: 'ADMIN_LIST' } ],
    }),

    getAdminProduct: builder.query({
      query: (id: string) => `/admin/products/${id}`,
      providesTags: (_result, _error, id) => [ { type: 'Product', id } ],
    }),

    // POST /api/v1/products (multipart)
    createProduct: builder.mutation({
      query: (product: Parameters<typeof buildProductFormData>[0]) => ({
        url: '/products',
        method: 'POST',
        body: buildProductFormData(product),
      }),
      invalidatesTags: [ { type: 'Product', id: 'ADMIN_LIST' }, { type: 'Product', id: 'LIST' }, { type: 'Product', id: 'FEATURED' } ],
    }),

    // PUT /api/v1/products/:id (multipart)
    updateProduct: builder.mutation({
      query: ({ id, ...product }: { id: string } & Parameters<typeof buildProductFormData>[0]) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: buildProductFormData(product),
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id }, { type: 'Product', id: 'ADMIN_LIST' }, { type: 'Product', id: 'LIST' }, { type: 'Product', id: 'FEATURED' },
      ],
    }),

    // DELETE /api/v1/products/:id
    deleteProduct: builder.mutation({
      query: (id: string) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      // Must also invalidate FEATURED (a deleted product left the homepage's
      // featured cache stale) and the product's own detail tag (its product
      // page / cart / wishlist entries kept serving cached data as if it
      // still existed) — matching the tags createProduct/updateProduct use.
      invalidatesTags: (_result, _error, id) => [
        { type: 'Product', id: 'ADMIN_LIST' },
        { type: 'Product', id: 'LIST' },
        { type: 'Product', id: 'FEATURED' },
        { type: 'Product', id },
      ],
    }),

    // PATCH /api/v1/admin/products/:id/featured
    toggleFeatured: builder.mutation({
      query: (id: string) => ({
        url: `/admin/products/${id}/featured`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Product', id }, { type: 'Product', id: 'ADMIN_LIST' }, { type: 'Product', id: 'FEATURED' },
      ],
    }),

    // PATCH /api/v1/admin/products/:id/stock
    updateStock: builder.mutation({
      query: ({ id, stock }: { id: string; stock: number }) => ({
        url: `/admin/products/${id}/stock`,
        method: 'PATCH',
        body: { stock },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id }, { type: 'Product', id: 'ADMIN_LIST' },
      ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetAdminProductsQuery,
  useGetAdminProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useToggleFeaturedMutation,
  useUpdateStockMutation,
} = adminProductsApi
