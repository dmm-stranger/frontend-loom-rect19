import { createBrowserRouter } from 'react-router-dom'
import AuthGuard from './AuthGuard'
import AdminGuard from './AdminGuard'
import RootLayout from '@/components/layout/RootLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import HomePage from '@/pages/Home/index'
import CatalogPage from '@/pages/Catalog/index'
import ProductDetail from '@/pages/ProductDetail/index'
import CartPage from '@/pages/Cart/index'
import CheckoutPage from '@/pages/Checkout/index'
import AccountPage from '@/pages/Account/index'
import LoginPage from '@/pages/Auth/Login'
import RegisterPage from '@/pages/Auth/Register'
import NotFoundPage from '@/pages/NotFound/index'
import AdminDashboard from '@/pages/Admin/Dashboard'
import AdminOrdersList from '@/pages/Admin/Orders/index'
import AdminOrderDetail from '@/pages/Admin/Orders/Detail'
import AdminProductsList from '@/pages/Admin/Products/index'
import AdminProductForm from '@/pages/Admin/Products/Form'
import AdminCategories from '@/pages/Admin/Categories/index'
import AdminUsers from '@/pages/Admin/Users/index'
import AdminCoupons from '@/pages/Admin/Coupons/index'
import AdminReviews from '@/pages/Admin/Reviews/index'
import AdminSettings from '@/pages/Admin/Settings/index'

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
      {
        path: 'admin',
        element: <AdminGuard />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboard /> },
              { path: 'orders', element: <AdminOrdersList /> },
              { path: 'orders/:orderId', element: <AdminOrderDetail /> },
              { path: 'products', element: <AdminProductsList /> },
              { path: 'products/new', element: <AdminProductForm /> },
              { path: 'products/:productId/edit', element: <AdminProductForm /> },
              { path: 'categories', element: <AdminCategories /> },
              { path: 'users', element: <AdminUsers /> },
              { path: 'coupons', element: <AdminCoupons /> },
              { path: 'reviews', element: <AdminReviews /> },
              { path: 'settings', element: <AdminSettings /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])