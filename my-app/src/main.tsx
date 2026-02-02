import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './bookMainCSS.css'
import App from './bookMain.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
