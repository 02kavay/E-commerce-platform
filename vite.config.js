import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Configured for automated GitHub Pages deployment via Actions
export default defineConfig({
  plugins: [react()],
  base: '/E-commerce-platform/',
})
