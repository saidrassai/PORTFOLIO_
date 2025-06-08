import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  
  // Base URL for assets - use different base for dev vs prod
  base: mode === 'production' ? '/' : '/',
  
  // Production optimizations
  build: {
    // Output directory
    outDir: 'dist',
    
    // Asset size warnings
    chunkSizeWarningLimit: 1000,
    
    // Ensure proper asset handling
    assetsDir: 'assets',
    
    // Rollup options for optimization
    rollupOptions: {
      output: {
        // Optimized manual chunks for better caching
        manualChunks: {
          // Core React
          'react-vendor': ['react', 'react-dom'],
          
          // Animations
          'animation-libs': ['gsap'],
          
          // UI Libraries  
          'ui-libs': ['lucide-react'],
          
          // Utils
          'utils': ['web-vitals']
        },
        // Ensure proper file extensions
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name]-[hash].css';
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    
    // Source maps for debugging
    sourcemap: false, // Set to true if you need source maps in production
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: true,
    // Add MIME type headers
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
    },
  },
  
  // Development server configuration
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    // Remove MIME type headers that might be causing issues
  },
}))
