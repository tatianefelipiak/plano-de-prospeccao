import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/plano-de-prospeccao/',
  plugins: [react()]
})
