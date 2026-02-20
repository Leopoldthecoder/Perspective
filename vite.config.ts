/// <reference types="vitest/config" />
import { defineConfig, type LibraryFormats } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'perspective',
      formats: ['es', 'cjs', 'umd'] as LibraryFormats[],
      fileName: (format: string) => `perspective.${format}.js`,
    },
    sourcemap: true,
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.ts'],
  },
})
