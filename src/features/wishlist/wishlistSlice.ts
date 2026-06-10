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

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions

export const selectWishlist = (state: { wishlist: WishlistState }) => state.wishlist.items
export const selectIsWishlisted = (productId: string) => (state: { wishlist: WishlistState }) =>
  state.wishlist.items.includes(productId)

export default wishlistSlice.reducer