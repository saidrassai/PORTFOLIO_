import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Simple performance monitoring for production
const reportWebVitals = () => {
  if (import.meta.env.PROD && 'PerformanceObserver' in window) {
    // Track Largest Contentful Paint
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (window.gtag && entry.entryType === 'largest-contentful-paint') {
          window.gtag('event', 'web_vitals', {
            name: 'LCP',
            value: entry.startTime,
            event_category: 'Performance',
          });
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Fallback for browsers that don't support all entry types
      console.log('Performance monitoring not fully supported');
    }
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Initialize performance monitoring
reportWebVitals();
