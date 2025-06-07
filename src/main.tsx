import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppMinimal from './App_minimal.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppMinimal />
  </StrictMode>,
)
