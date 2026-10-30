import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

function requiresRequireEsmFlag(): boolean {
  const [major = 0, minor = 0] = process.versions.node.split('.').map(Number)
  if (major === 20) return minor < 19
  if (major === 21) return true
  if (major === 22) return minor < 12
  return false
}

const execArgv = requiresRequireEsmFlag() ? ['--experimental-require-module'] : []

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          icons: ['lucide-react'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: false,
    restoreMocks: true,
    execArgv,
  },
})
