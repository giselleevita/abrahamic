import { defineConfig, devices } from '@playwright/test'

const port = 3100
if (process.env.CI && (!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH || !process.env.RATE_LIMIT_SECRET)) {
  throw new Error('CI requires synthetic editorial credentials for the inbox scenario')
}

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
  },
})
