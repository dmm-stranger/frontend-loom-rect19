// @ts-ignore
// @ts-nocheck


import { useSelector, useDispatch } from 'react-redux'
import {
  addItem,
  removeItem,
  updateQty,
  clearCart,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
} from '../features/cart/cartSlice'
import type { AppDispatch } from '../app/store'

export function useCart() {
  const dispatch = useDispatch<AppDispatch>()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const itemCount = useSelector(selectCartCount)

  return {
    items,
    total,
    itemCount,
    addToCart: (product: any) => dispatch(addItem(product)),
    removeFromCart: (productId: string) => dispatch(removeItem(productId)),
    updateQuantity: (productId: string, qty: number) => dispatch(updateQty({ productId, qty })),
    clearCart: () => dispatch(clearCart()),
  }
}