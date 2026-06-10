import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import App from '@/App'
import './index.css'

const root = document.getElementById('root')

if (!root) {
  document.body.innerHTML = '<h1 style="color:red">ROOT NOT FOUND</h1>'
} else {
  createRoot(root).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  )
}