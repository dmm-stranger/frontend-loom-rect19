import { createBrowserRouter } from 'react-router-dom'
import AuthGuard from './AuthGuard'
import RootLayout from '@/components/layout/RootLayout'
import HomePage from '@/pages/Home/index'
import CatalogPage from '@/pages/Catalog/index'
import ProductDetail from '@/pages/ProductDetail/index'
import CartPage from '@/pages/Cart/index'
import CheckoutPage from '@/pages/Checkout/index'
import AccountPage from '@/pages/Account/index'
import LoginPage from '@/pages/Auth/Login'
import RegisterPage from '@/pages/Auth/Register'
import NotFoundPage from '@/pages/NotFound/index'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'catalog/:categorySlug', element: <CatalogPage /> },
      { path: 'products/:productId', element: <ProductDetail /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'auth/login', element: <LoginPage /> },
      { path: 'auth/register', element: <RegisterPage /> },
      {
        element: <AuthGuard />,
        children: [
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'account', element: <AccountPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])