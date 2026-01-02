// sync-forced-2025
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'TrebolSoft',
        short_name: 'TrebolSoft',
        description: 'Sistema de gestión de créditos y cobranza',
        theme_color: '#10b981',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      // Eliminamos la configuración de workbox que apuntaba a Render
    })
  ],
  server: {
    port: 3000,
    // Proxy para redirigir las llamadas /api al backend en desarrollo
    proxy: {
      '/api': {
        target: 'http://localhost:10000', // El puerto del backend V1
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Opcional: si el backend no espera /api
      }
    }
  }
})
