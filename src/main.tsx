import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './utils/sw-registration' // Register service worker
import { initializeAnalytics } from './utils/analytics' // Import comprehensive analytics

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Initialize comprehensive performance monitoring
initializeAnalytics();
