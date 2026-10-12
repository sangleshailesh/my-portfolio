import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  build: {
    // Surfaces a regression before it ships rather than after. The home page
    // carries no animation library, so this is a realistic ceiling.
    chunkSizeWarningLimit: 250,
    cssCodeSplit: true,
    reportCompressedSize: true,

    rollupOptions: {
      output: {
        // Rolldown (Vite 8's bundler) takes manualChunks only as a function.
        //
        // React and the router change on their own schedule and are shared by
        // every route, so they get their own chunks: editing page copy then
        // does not invalidate the framework chunk in visitors' caches.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
          if (id.includes('react-router')) return 'router'
          return undefined
        },
      },
    },
  },

  server: {
    open: false,
  },
})
