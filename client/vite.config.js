import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // Tells the server to redirect 404s back to index.html locally
  }
})
