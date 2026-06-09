import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    // slices will be added here one by one
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch