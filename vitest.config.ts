import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    // Unit tests only; Playwright e2e specs live in tests/e2e and run separately.
    include: ['tests/unit/**/*.test.ts'],
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
