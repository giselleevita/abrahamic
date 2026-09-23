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
