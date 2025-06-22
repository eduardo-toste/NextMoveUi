import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite acesso de qualquer IP
    port: 5173, // Porta padrão do Vite
    strictPort: true, // Usa a porta especificada
  },
})
