import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes/router'
import { useDispatch, useSelector } from 'react-redux'
import { useGetMeQuery } from '@/features/auth/authApi'
import { selectToken, setCredentials, logout } from '@/features/auth/authSlice'
import type { AppDispatch } from '@/app/store'

function AppContent() {
  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector(selectToken)

  // Fetch user profile if token exists
  const { data, isError } = useGetMeQuery(undefined, {
    skip: !token,
  })

  useEffect(() => {
    if (data?.data?.user) {
      dispatch(setCredentials({
        user: data.data.user,
        token: token!,
      }))
    }
    if (isError) {
      // Token is invalid or expired — clear it
      dispatch(logout())
    }
  }, [ data, isError, dispatch, token ])

  return <RouterProvider router={router} />
}

export default function App() {
  return <AppContent />
}