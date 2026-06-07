import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import LoomDemo from '../demo/LoomDemo'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <LoomDemo /> */}

  </StrictMode>
)
