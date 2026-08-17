// Shared across admin Dashboard, Orders, and any order-status badges.
export const STATUS_COLORS: Record<string, string> = {
  processing: '#f59e0b',
  shipped: '#00cfff',
  delivered: '#00e599',
  cancelled: '#ff4d6a',
}

export const STOCK_FILTERS = [
  { label: 'All', value: '' },
  { label: 'In Stock', value: 'in' },
  { label: 'Low Stock (≤5)', value: 'low' },
  { label: 'Out of Stock', value: 'out' },
]
