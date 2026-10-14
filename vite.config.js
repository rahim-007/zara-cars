import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react'
            }
            if (id.includes('gsap') || id.includes('lenis')) {
              return 'vendor-motion'
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase'
            }
            if (id.includes('@phosphor-icons')) {
              return 'vendor-icons'
            }
          }
        }
      }
    }
  }
})
