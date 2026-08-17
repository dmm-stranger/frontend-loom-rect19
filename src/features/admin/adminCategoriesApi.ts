import { baseApi } from '@/app/api/baseApi'

function buildCategoryFormData(category: { name: string; parent?: string | null; image?: File | null }) {
  const fd = new FormData()
  fd.append('name', category.name)
  if (category.parent) fd.append('parent', category.parent)
  if (category.image) fd.append('image', category.image)
  return fd
}

export const adminCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Reuses the public GET /categories list — admin sees the same data,
    // there's no separate /admin/categories endpoint on the backend.
    getAdminCategories: builder.query({
      query: () => '/categories',
      providesTags: (result) =>
        result?.data?.categories
          ? [
            ...result.data.categories.map(({ _id }: any) => ({ type: 'Category' as const, id: _id })),
            { type: 'Category' as const, id: 'LIST' },
          ]
          : [ { type: 'Category' as const, id: 'LIST' } ],
    }),

    // POST /api/v1/categories (multipart)
    createCategory: builder.mutation({
      query: (category: Parameters<typeof buildCategoryFormData>[0]) => ({
        url: '/categories',
        method: 'POST',
        body: buildCategoryFormData(category),
      }),
      invalidatesTags: [ { type: 'Category', id: 'LIST' } ],
    }),

    // PUT /api/v1/categories/:id (multipart)
    updateCategory: builder.mutation({
      query: ({ id, ...category }: { id: string } & Parameters<typeof buildCategoryFormData>[0]) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: buildCategoryFormData(category),
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Category', id }, { type: 'Category', id: 'LIST' },
      ],
    }),

    // DELETE /api/v1/categories/:id
    deleteCategory: builder.mutation({
      query: (id: string) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [ { type: 'Category', id: 'LIST' } ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetAdminCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = adminCategoriesApi
