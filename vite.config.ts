import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Base URL for assets - use absolute path for production
  base: '/',
  
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
        // Manual chunks for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          'three-core': ['three'],
          'three-fiber': ['@react-three/fiber'],
          'three-drei': ['@react-three/drei'],
          // Note: @react-three/rapier is intentionally excluded to allow lazy loading
          'three-postprocessing': ['@react-three/postprocessing'],
          ui: ['lucide-react', 'gsap'],
          recaptcha: ['react-google-recaptcha'],
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
    strictPort: true,
    // Add MIME type headers for development
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
    },
  },
})
