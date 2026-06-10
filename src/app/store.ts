import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import cartReducer from '@/features/cart/cartSlice'
import wishlistReducer from '@/features/wishlist/wishlistSlice'
import uiReducer from '@/features/ui/uiSlice'
import productsReducer from '@/features/products/productsSlice'
import { baseApi } from '@/app/api/baseApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
    products: productsReducer,
    [ baseApi.reducerPath ]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch