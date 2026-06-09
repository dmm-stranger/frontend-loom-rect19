// @ts-ignore
// @ts-nocheck


import { createSlice } from '@reduxjs/toolkit'

interface UiState {
  cartDrawerOpen: boolean
  mobileMenuOpen: boolean
  filterDrawerOpen: boolean
  theme: 'dark' | 'light'
}

const initialState: UiState = {
  cartDrawerOpen: false,
  mobileMenuOpen: false,
  filterDrawerOpen: false,
  theme: 'dark',
}

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
  },
})

export const {
  openCartDrawer, closeCartDrawer,
  openMobileMenu, closeMobileMenu,
  openFilterDrawer, closeFilterDrawer,
  toggleTheme,
} = uiSlice.actions

export const selectCartDrawerOpen = (state: { ui: UiState }) => state.ui.cartDrawerOpen
export const selectMobileMenuOpen = (state: { ui: UiState }) => state.ui.mobileMenuOpen
export const selectFilterDrawerOpen = (state: { ui: UiState }) => state.ui.filterDrawerOpen
export const selectTheme = (state: { ui: UiState }) => state.ui.theme

export default uiSlice.reducer