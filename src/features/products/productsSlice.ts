// @ts-ignore
// @ts-nocheck


import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProductsState {
  activeFilters: {
    brands: string[]
    priceRange: string | null
    rating: number | null
    categorySlug: string | null
  }
  sortBy: string
  page: number
  perPage: number
  search: string
}

const initialState: ProductsState = {
  activeFilters: {
    brands: [],
    priceRange: null,
    rating: null,
    categorySlug: null,
  },
  sortBy: 'featured',
  page: 1,
  perPage: 12,
  search: '',
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    toggleBrandFilter: (state, action: PayloadAction<string>) => {
      const idx = state.activeFilters.brands.indexOf(action.payload)
      if (idx === -1) state.activeFilters.brands.push(action.payload)
      else state.activeFilters.brands.splice(idx, 1)
      state.page = 1
    },
    setPriceRange: (state, action: PayloadAction<string | null>) => {
      state.activeFilters.priceRange = action.payload
      state.page = 1
    },
    setRatingFilter: (state, action: PayloadAction<number | null>) => {
      state.activeFilters.rating = action.payload
      state.page = 1
    },
    setCategorySlug: (state, action: PayloadAction<string | null>) => {
      state.activeFilters.categorySlug = action.payload
      state.page = 1
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload
      state.page = 1
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
      state.page = 1
    },
    clearFilters: (state) => {
      state.activeFilters = initialState.activeFilters
      state.sortBy = 'featured'
      state.page = 1
      state.search = ''
    },
  },
})

export const {
  toggleBrandFilter, setPriceRange, setRatingFilter,
  setCategorySlug, setSortBy, setPage, setSearch, clearFilters,
} = productsSlice.actions

export const selectFilters = (state: { products: ProductsState }) => state.products.activeFilters
export const selectSortBy = (state: { products: ProductsState }) => state.products.sortBy
export const selectPage = (state: { products: ProductsState }) => state.products.page
export const selectSearch = (state: { products: ProductsState }) => state.products.search

export default productsSlice.reducer