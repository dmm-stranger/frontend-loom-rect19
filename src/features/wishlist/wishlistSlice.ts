import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface WishlistState {
  items: string[]
}

const initialState: WishlistState = {
  items: [],
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Sync backend wishlist productIds into Redux
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.items = action.payload
    },
    // Toggle for non-logged in users (Redux only)
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const idx = state.items.indexOf(action.payload)
      if (idx === -1) state.items.push(action.payload)
      else state.items.splice(idx, 1)
    },
    clearWishlist: (state) => {
      state.items = []
    },
  },
})

export const { setWishlist, toggleWishlist, clearWishlist } = wishlistSlice.actions

export const selectWishlist = (state: { wishlist: WishlistState }) => state.wishlist.items
export const selectIsWishlisted = (id: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist.items.includes(id)

export default wishlistSlice.reducer