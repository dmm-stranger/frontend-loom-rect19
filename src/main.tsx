import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import App from '@/App'
import './index.css'

// Apply theme class to body on startup
const applyTheme = () => {
  const theme = store.getState().ui.theme
  document.body.classList.remove('dark', 'light')
  document.body.classList.add(theme)
}

applyTheme()
store.subscribe(applyTheme)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)