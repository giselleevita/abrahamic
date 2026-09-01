import { defineConfig } from 'vitest/config'
import path from 'path'
import dotenv from 'dotenv'

// Load .env so DB-backed tests (prisma/schema.check.test.ts) can connect.
// They skip themselves when DATABASE_URL is absent, keeping unit runs offline.
dotenv.config()

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'prisma/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
