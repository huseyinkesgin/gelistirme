import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  root: 'src/renderer',
  base: './',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/renderer/index.html')
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/renderer/components'),
      '@/views': resolve(__dirname, 'src/renderer/views'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/models': resolve(__dirname, 'src/models'),
      '@/types': resolve(__dirname, 'src/types')
    }
  },
  server: {
    port: 3000
  }
})