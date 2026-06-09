import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// During `netlify dev` the dev server runs on http://localhost:8888
// and proxies /api/* to the serverless function.  We mirror that here
// for plain `vite` dev too, so both setups behave the same.
const NETLIFY_DEV = 'http://localhost:8888'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: NETLIFY_DEV,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
