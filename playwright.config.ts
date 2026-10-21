import { defineConfig, devices } from '@playwright/test'
import bcrypt from 'bcryptjs'

const port = 3100
if (process.env.CI && (!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH || !process.env.RATE_LIMIT_SECRET)) {
  throw new Error('CI requires synthetic editorial credentials for the inbox scenario')
}

// Synthetic editorial credentials, set explicitly so a developer's local .env
// can never leak into (or break) the inbox scenario. Process env beats .env in Next.
process.env.E2E_ADMIN_EMAIL ??= 'editorial-ci@example.test'
process.env.E2E_ADMIN_PASSWORD ??= 'synthetic-ci-editorial-password'
process.env.ADMIN_EMAIL ??= process.env.E2E_ADMIN_EMAIL
process.env.RATE_LIMIT_SECRET ??= 'synthetic-ci-quota-secret-at-least-32-characters'
process.env.ADMIN_PASSWORD_HASH ??= bcrypt.hashSync(process.env.E2E_ADMIN_PASSWORD, 10)

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://127.0.0.1:${port}`, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } } },
    { name: 'mobile-320', use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 740 }, isMobile: false, reducedMotion: 'reduce' } },
  ],
  webServer: {
    command: `npm start -- --port ${port}`,
    url: `http://127.0.0.1:${port}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
      // Next re-expands `$` in env values when the server starts, which truncates a bcrypt hash.
      ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH!.replace(/\$/g, '\\$'),
      RATE_LIMIT_SECRET: process.env.RATE_LIMIT_SECRET!,
    },
  },
})
