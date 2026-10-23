// Usage: node scripts/check-experience-performance.mjs http://127.0.0.1:3101 http://127.0.0.1:3100
// Both URLs must serve production builds against the same demonstration corpus.
import { chromium } from '@playwright/test'

const [baseline, updated] = process.argv.slice(2)
if (!baseline || !updated) throw new Error('Supply baseline and updated production server URLs.')
const browser = await chromium.launch({ headless: true })
const results = []
try {
  for (const route of ['/', '/learn/abraham-across-traditions', '/timeline', '/comparisons', '/family-tree', '/glossary', '/search?q=Abraham', '/kids/stories', '/kids/games', '/sources/torah/read?book=Genesis&chapter=22', '/sources/quran/read?book=Al-Ikhlas&chapter=112']) {
    const measurements = []
    for (const origin of [baseline, updated]) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
      const page = await context.newPage()
      await page.addInitScript(() => {
        window.layoutShiftTotal = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.layoutShiftTotal += entry.value
        }).observe({ type: 'layout-shift', buffered: true })
      })
      await page.goto(new URL(route, origin).href)
      await page.waitForLoadState('networkidle')
      measurements.push(await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource').filter((entry) => /\.(js|css)(\?|$)/.test(entry.name) && entry.name.includes('/_next/'))
        return {
          bytes: resources.reduce((sum, entry) => sum + entry.encodedBodySize, 0) + performance.getEntriesByType('navigation')[0].encodedBodySize,
          layoutShift: window.layoutShiftTotal,
        }
      }))
      await context.close()
    }
    const increasePercent = Number(((measurements[1].bytes / measurements[0].bytes - 1) * 100).toFixed(2))
    results.push({ route, baseline: measurements[0], updated: measurements[1], increasePercent })
  }
} finally {
  await browser.close()
}
console.log(JSON.stringify(results, null, 2))
if (results.some((row) => row.increasePercent > 10)) process.exitCode = 1
