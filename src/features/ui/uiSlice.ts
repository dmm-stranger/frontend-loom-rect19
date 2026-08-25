import { createSlice } from '@reduxjs/toolkit'

// Detect system preference on first load
const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }
  return 'dark'
}

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface UiState {
  cartDrawerOpen: boolean
  mobileMenuOpen: boolean
  filterDrawerOpen: boolean
  theme: 'dark' | 'light'
  toasts: Toast[]
}

const initialState: UiState = {
  cartDrawerOpen: false,
  mobileMenuOpen: false,
  filterDrawerOpen: false,
  theme: getSystemTheme(),
  toasts: [],
}

let toastIdCounter = 0

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCartDrawer: (state) => { state.cartDrawerOpen = true },
    closeCartDrawer: (state) => { state.cartDrawerOpen = false },
    openMobileMenu: (state) => { state.mobileMenuOpen = true },
    closeMobileMenu: (state) => { state.mobileMenuOpen = false },
    openFilterDrawer: (state) => { state.filterDrawerOpen = true },
    closeFilterDrawer: (state) => { state.filterDrawerOpen = false },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    // Show a transient toast (e.g. "Added to cart"). Consumers should also
    // set up a timeout to dispatch removeToast, or rely on ToastContainer
    // doing it automatically.
    addToast: {
      reducer: (state, action: { payload: Toast }) => {
        state.toasts.push(action.payload)
      },
      prepare: (message: string, type: Toast['type'] = 'success') => ({
        payload: { id: ++toastIdCounter, message, type },
      }),
    },
    removeToast: (state, action: { payload: number }) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload)
    },
  },
})

export const {
  openCartDrawer, closeCartDrawer,
  openMobileMenu, closeMobileMenu,
  openFilterDrawer, closeFilterDrawer,
  toggleTheme,
  addToast, removeToast,
} = uiSlice.actions

export const selectCartDrawerOpen = (state: { ui: UiState }) => state.ui.cartDrawerOpen
export const selectMobileMenuOpen = (state: { ui: UiState }) => state.ui.mobileMenuOpen
export const selectFilterDrawerOpen = (state: { ui: UiState }) => state.ui.filterDrawerOpen
export const selectTheme = (state: { ui: UiState }) => state.ui.theme
export const selectToasts = (state: { ui: UiState }) => state.ui.toasts

export default uiSlice.reducer