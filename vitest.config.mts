import { defineConfig } from 'vitest/config'
import dotenv from 'dotenv'

dotenv.config()

// `.mts` so the ESM syntax here is loaded as ESM, matching the rest of the
// repo's config files. Path aliases (`@/*`) resolve natively from tsconfig.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    projects: [
      {
        resolve: { tsconfigPaths: true },
        test: {
          name: 'node',
          environment: 'node',
          // Route tests import large server modules; the first import in a worker can be slow on CI.
          testTimeout: 20_000,
          hookTimeout: 30_000,
          include: [
            'tests/{lib,api,app}/**/*.test.ts',
            'src/**/*.test.ts',
            'prisma/**/*.test.ts',
          ],
        },
      },
      {
        resolve: { tsconfigPaths: true },
        test: {
          name: 'dom',
          environment: 'jsdom',
          setupFiles: ['tests/setup.ts'],
          include: ['tests/components/**/*.test.tsx'],
        },
      },
    ],
  },
})
