// @ts-ignore
// @ts-nocheck


export const validators = {
  email: (val: string) => {
    if (!val) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email'
    return null
  },
  password: (val: string) => {
    if (!val) return 'Password is required'
    if (val.length < 8) return 'Password must be at least 8 characters'
    return null
  },
  required: (val: string, fieldName = 'This field') => {
    if (!val || !String(val).trim()) return `${fieldName} is required`
    return null
  },
}