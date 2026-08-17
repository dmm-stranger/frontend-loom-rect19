import { baseApi } from '@/app/api/baseApi'

export const adminSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/v1/admin/settings
    getSettings: builder.query({
      query: () => '/admin/settings',
      providesTags: [ 'Settings' ],
    }),

    // PATCH /api/v1/admin/settings — partial update
    updateSettings: builder.mutation({
      query: (patch: any) => ({
        url: '/admin/settings',
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: [ 'Settings' ],
    }),

  }),
  overrideExisting: false,
})

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = adminSettingsApi
