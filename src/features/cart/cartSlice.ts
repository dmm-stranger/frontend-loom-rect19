import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface CartItem {
  productId: string
  name: string
  price: number
  qty: number
  image: string
}

interface CartState {
  items: CartItem[]
  coupon: string | null
  status: 'idle' | 'syncing'
}

const initialState: CartState = {
  items: [],
  coupon: null,
  status: 'idle',
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(i => i.productId === action.payload.productId)
      if (existing) {
        existing.qty += 1
      } else {
        state.items.push({ ...action.payload, qty: 1 })
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.productId !== action.payload)
    },
    updateQty: (state, action: PayloadAction<{ productId: string; qty: number }>) => {
      const item = state.items.find(i => i.productId === action.payload.productId)
      if (item) item.qty = action.payload.qty < 1 ? 1 : action.payload.qty
    },
    applyCoupon: (state, action: PayloadAction<string>) => {
      state.coupon = action.payload
    },
    removeCoupon: (state) => {
      state.coupon = null
    },
    clearCart: (state) => {
      state.items = []
      state.coupon = null
    },
  },
})

export const {
  addItem, removeItem, updateQty,
  applyCoupon, removeCoupon, clearCart,
} = cartSlice.actions

export const selectCartItems = (state: { cart: CartState }) => state.cart.items
export const selectCartCount = (state: { cart: CartState }) => state.cart.items.reduce((n, i) => n + i.qty, 0)
export const selectCartTotal = (state: { cart: CartState }) => state.cart.items.reduce((s, i) => s + i.price * i.qty, 0)

export default cartSlice.reducer