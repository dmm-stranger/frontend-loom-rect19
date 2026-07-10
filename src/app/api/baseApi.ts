import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store'

export const baseApi = createApi({
  reducerPath: 'baseApi',

  baseQuery: fetchBaseQuery({
    // Development: http://localhost:8000/api/v1
    // Production:  set VITE_API_BASE_URL in .env
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',

    // Required for httpOnly cookies to be sent with every request
    credentials: 'include',

    prepareHeaders: (headers, { getState }) => {
      // Also send Bearer token for compatibility
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),

  // All resources your backend exposes
  tagTypes: [
    'Product',
    'Category',
    'Cart',
    'Wishlist',
    'Order',
    'Review',
    'User',
    'Coupon',
  ],

  endpoints: () => ({}),
})