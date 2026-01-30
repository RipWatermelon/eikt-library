import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './vibes.css'
import App from './vibes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
