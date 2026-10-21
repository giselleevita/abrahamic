import { expect, test, type Page } from '@playwright/test'

// Each test runs in the desktop, tablet and 320px projects (see playwright.config.ts).
// Keyboard checks focus the control and press the key, which is what a keyboard user's Tab
// ends on; they fail if the element is not a focusable, key-operable control.

/** Collects page errors and fails the test if the page threw or the layout overflowed sideways. */
function watch(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  // The Vercel analytics script only exists on Vercel; its 404 is not an app error. Any other failed request is.
  page.on('console', (m) => { if (m.type() === 'error' && !/_vercel|Failed to load resource/.test(m.text())) errors.push(m.text()) })
  page.on('response', (r) => { if (r.status() >= 400 && !r.url().includes('/_vercel/')) errors.push(`${r.status()} ${r.url()}`) })
  return async () => {
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(errors).toEqual([])
  }
}

async function press(page: Page, locator: ReturnType<Page['locator']>, key = 'Enter') {
  await locator.focus()
  await expect(locator).toBeFocused()
  await page.keyboard.press(key)
}

test('home: choose-your-path doors and the scroll cue', async ({ page }) => {
  const done = watch(page)
  await page.goto('/')
  await page.getByRole('link', { name: /Scroll to discover/ }).click()
  await expect(page).toHaveURL(/#choose-path$/)
  const paths = page.getByRole('region', { name: 'Pick the way in that suits you' })
  await expect(paths.getByRole('link')).toHaveCount(5)
  await expect(paths.getByRole('link', { name: /I’m new here/ })).toHaveAttribute('href', '/learn')
  await expect(paths.getByRole('link', { name: /big picture/ })).toHaveAttribute('href', '/family-tree#big-picture-title')
  // Keyboard: Enter on a door navigates.
  await press(page, paths.getByRole('link', { name: /curious about a person/ }))
  await expect(page).toHaveURL(/\/figures$/)
  await done()
})

test('timeline player: next, play, pause and jump to a period', async ({ page }) => {
  const done = watch(page)
  await page.goto('/timeline')
  const player = page.getByRole('region', { name: /Play the story/ })
  const progress = player.getByRole('progressbar', { name: 'Story progress' })
  await expect(progress).toHaveAttribute('aria-valuenow', '1')
  await expect(player.getByRole('button', { name: 'Previous event' })).toBeDisabled()
  await player.getByRole('button', { name: 'Next event' }).click()
  await expect(progress).toHaveAttribute('aria-valuenow', '2')
  await player.getByRole('button', { name: 'Previous event' }).click()
  await expect(progress).toHaveAttribute('aria-valuenow', '1')
  const play = player.getByRole('button', { name: /Play$/ })
  await play.click()
  await expect(player.getByRole('button', { name: /Pause/ })).toHaveAttribute('aria-pressed', 'true')
  await player.getByRole('button', { name: /Pause/ }).click()
  await expect(player.getByRole('button', { name: /Play$/ })).toHaveAttribute('aria-pressed', 'false')
  const periods = player.getByRole('group', { name: 'Jump to a period' }).getByRole('button')
  expect(await periods.count()).toBeGreaterThan(1)
  await press(page, periods.nth(1), 'Space')
  await expect(periods.nth(1)).toHaveAttribute('aria-pressed', 'true')
  expect(Number(await progress.getAttribute('aria-valuenow'))).toBeGreaterThan(1)
  await expect(player.getByRole('img').first()).toHaveAttribute('alt', /.+/)
  await done()
})

test('family tree: trace a line, fold descendants, zoom', async ({ page }) => {
  const done = watch(page)
  await page.goto('/family-tree')
  const tree = page.getByRole('group', { name: /^Family tree:/ }).first()
  const person = tree.getByRole('button', { name: /: trace their line$/ }).nth(1)
  await press(page, person)
  const status = page.getByRole('status').filter({ hasText: 'Tracing' })
  await expect(status).toBeVisible()
  await expect(status.getByRole('link', { name: /^Read about/ })).toBeVisible()
  await page.getByRole('button', { name: 'Clear selection' }).click()
  await expect(status).toHaveCount(0)
  const fold = tree.getByRole('button', { name: /^Hide the descendants of/ }).first()
  const foldName = (await fold.getAttribute('aria-label'))!.replace('Hide', 'Show')
  const before = await tree.getByRole('button', { name: /: trace their line$/ }).count()
  await press(page, fold)
  await expect(tree.getByRole('button', { name: foldName })).toBeVisible()
  expect(await tree.getByRole('button', { name: /: trace their line$/ }).count()).toBeLessThan(before)
  await page.getByRole('button', { name: 'Zoom in' }).click()
  await page.getByRole('button', { name: 'Reset', exact: true }).click()
  await done()
})

test('big-picture diagram: a person opens names across the traditions', async ({ page }) => {
  const done = watch(page)
  await page.goto('/family-tree#big-picture-title')
  const node = page.getByRole('button', { name: /: show names across the traditions$/ }).first()
  await press(page, node)
  const card = page.locator('aside[aria-live=polite]').filter({ has: page.getByRole('button', { name: 'Close' }) })
  await expect(card).toBeVisible()
  await expect(card.getByRole('heading', { level: 3 })).not.toBeEmpty()
  await card.getByRole('button', { name: 'Close' }).click()
  await expect(card).toHaveCount(0)
  await done()
})

test('daily challenge records a streak that the album shows', async ({ page }) => {
  const done = watch(page)
  await page.goto('/daily')
  const quiz = page.getByRole('region', { name: /Three questions about names/ })
  for (let q = 0; q < 3; q++) {
    await expect(quiz.getByText(`Question ${q + 1} of 3`)).toBeVisible()
    await press(page, quiz.locator('.grid button').first())
    await press(page, quiz.getByRole('button', { name: q < 2 ? 'Next' : 'See result' }))
  }
  await expect(quiz.getByText(/You got \d out of 3\./)).toBeVisible()
  await page.getByRole('link', { name: /See my streak and badges/ }).click()
  await expect(page).toHaveURL(/\/album$/)
  await expect(page.getByText('day in a row')).toBeVisible()
  await expect(page.getByText('challenges finished').locator('xpath=preceding-sibling::p[1]')).toHaveText('1')
  expect(await page.evaluate(() => Object.keys(localStorage).some((k) => k.startsWith('abrahamic.')))).toBe(true)
  await done()
})

test('evidence board: place every statement, then check against the sources', async ({ page }) => {
  const done = watch(page)
  await page.goto('/evidence')
  const deck = page.getByRole('region', { name: /Statements to place/ })
  await expect(deck).toBeVisible()
  const check = page.getByRole('button', { name: 'Check', exact: true })
  await expect(check).toBeDisabled()
  const total = await deck.locator('li button').count()
  expect(total).toBeGreaterThanOrEqual(3)
  for (let k = 0; k < total; k++) {
    await press(page, deck.locator('li button').first())
    await press(page, page.getByRole('button', { name: 'Place here' }).nth(k % 3))
  }
  await expect(check).toBeEnabled()
  await press(page, check)
  await expect(page.getByText(new RegExp(`\\d of ${total} in the right column`))).toBeVisible()
  await expect(page.getByText(/^From: /).first()).toBeVisible()
  await press(page, page.getByRole('button', { name: 'New round' }))
  await expect(check).toBeDisabled()
  await done()
})

test('build the story: pin events to places, then order them', async ({ page }) => {
  const done = watch(page)
  await page.goto('/build-story')
  await expect(page.getByText('Step 1 of 2')).toBeVisible()
  const events = page.locator('ul > li > button[aria-pressed]')
  const total = await events.count()
  expect(total).toBeGreaterThanOrEqual(3)
  const places = page.getByRole('button', { name: /^Place the chosen event at / })
  for (let k = 0; k < total; k++) {
    await press(page, events.nth(k))
    await press(page, places.nth(k))
  }
  await press(page, page.getByRole('button', { name: 'Check the places' }))
  await expect(page.getByText(new RegExp(`\\d of ${total} in the right place`))).toBeVisible()
  await press(page, page.getByRole('button', { name: /Next: put them in order/ }))
  await expect(page.getByText('Step 2 of 2')).toBeVisible()
  const rows = page.locator('li:has(button[aria-label^="Move "])')
  const first = rows.first().locator('span.flex-1')
  const name = (await first.innerText()).split('\n')[0]
  await press(page, page.getByRole('button', { name: `Move ${name} later` }))
  await expect(rows.nth(1).locator('span.flex-1')).toContainText(name)
  await press(page, page.getByRole('button', { name: 'Check the order' }))
  await expect(page.getByText(new RegExp(`Places: \\d/${total} · Order: \\d/${total}`))).toBeVisible()
  await done()
})

test('map: era filter dims places and every place opens its story', async ({ page }) => {
  const done = watch(page)
  await page.goto('/map')
  const filter = page.getByRole('group', { name: 'Show places from' })
  const buttons = filter.getByRole('button')
  expect(await buttons.count()).toBeGreaterThan(2)
  await expect(buttons.first()).toHaveAttribute('aria-pressed', 'true')
  const dimmed = page.locator('li > button.opacity-40')
  await expect(dimmed).toHaveCount(0)
  await press(page, buttons.nth(1))
  await expect(buttons.nth(1)).toHaveAttribute('aria-pressed', 'true')
  await expect(buttons.first()).toHaveAttribute('aria-pressed', 'false')
  await expect(dimmed.first()).toBeVisible()
  await press(page, buttons.first())
  await expect(dimmed).toHaveCount(0)
  const mapPlace = page.getByRole('group', { name: /^Map of the Middle East/ }).getByRole('button', { name: /: show the story$/ }).nth(2)
  const label = (await mapPlace.getAttribute('aria-label'))!.replace(': show the story', '')
  await press(page, mapPlace)
  await expect(page.locator('article[aria-live=polite]').getByText(label, { exact: true })).toBeVisible()
  await done()
})

test('name explorer: a name from any tradition finds the person', async ({ page }) => {
  const done = watch(page)
  await page.goto('/names')
  await page.getByLabel('Type any name').fill('Musa')
  await expect(page.getByRole('heading', { level: 2, name: 'Moses' })).toBeVisible()
  await page.getByLabel('Type any name').fill('zzzzqq')
  await expect(page.getByText(/No one on the site has a name like/)).toBeVisible()
  await press(page, page.getByRole('button', { name: 'Ibrahim' }).or(page.getByRole('button', { name: /^(Moses|Musa|Moshe|Yeshua|Jesus)$/ })).first())
  await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible()
  await done()
})

test('compare two people: swap, and refuse the same person twice', async ({ page }) => {
  const done = watch(page)
  await page.goto('/compare-people')
  await expect(page.getByRole('heading', { name: 'What Moses and Muhammad share' })).toBeVisible()
  await press(page, page.getByRole('button', { name: 'Swap the two people' }))
  await expect(page.getByRole('heading', { name: 'What Muhammad and Moses share' })).toBeVisible()
  await page.getByLabel('First person').selectOption('moses')
  await expect(page.getByText('Choose two different people.')).toBeVisible()
  await done()
})

test('notebook: add a note and list item, reload, export, and refuse a crafted share link', async ({ page, context }) => {
  const done = watch(page)
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/figures/abraham')
  const keep = page.getByRole('region', { name: 'Keep this page' })
  await press(page, keep.getByRole('button', { name: /Add a private note/ }))
  await page.getByLabel(/^Your note about/).fill('Remember to compare the three accounts.')
  await press(page, page.getByRole('button', { name: 'Save note' }))
  await expect(keep.getByText('Note saved on this device.')).toBeVisible()
  await press(page, keep.getByRole('button', { name: /Add to my reading list/ }))
  await expect(keep.getByRole('button', { name: /In my reading list/ })).toHaveAttribute('aria-pressed', 'true')

  let sent = 0
  page.on('request', (r) => { if (r.method() !== 'GET' && !r.url().includes('/_next/')) sent++ })
  await page.goto('/notebook')
  await page.reload()
  await expect(page.getByText('Remember to compare the three accounts.')).toBeVisible()
  const list = page.getByRole('region', { name: 'Reading list' }).or(page.locator('section').filter({ has: page.getByRole('heading', { name: 'Reading list' }) }))
  await expect(list.getByRole('link').first()).toBeVisible()

  const download = page.waitForEvent('download')
  await press(page, page.getByRole('button', { name: /Download as Markdown/ }))
  expect((await download).suggestedFilename()).toBe('my-abrahamic-notes.md')

  await press(page, page.getByRole('button', { name: /Share my reading list/ }))
  await expect(page.getByText(/never your notes/)).toBeVisible()
  const link = await page.evaluate(() => navigator.clipboard.readText())
  expect(link).toContain('/collection?i=')
  expect(link).not.toContain('Remember')
  await page.goto(new URL(link).pathname + new URL(link).search)
  await expect(page.getByRole('link', { name: /Abraham/ }).first()).toBeVisible()

  // A hand-made link pointing off-site, or at a script, is dropped rather than rendered.
  const craft = (items: unknown) => Buffer.from(JSON.stringify(items)).toString('base64url')
  for (const bad of [[['https://evil.example/x', 'Click me']], [['javascript:alert(1)', 'Click me']], [['/admin', 'Admin']], 'not-base64!!']) {
    await page.goto(`/collection?i=${typeof bad === 'string' ? bad : craft(bad)}`)
    await expect(page.getByText('This link does not hold a valid reading list.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Click me' })).toHaveCount(0)
  }

  // Tampered device storage is filtered the same way, and nothing was sent anywhere.
  await page.evaluate(() => localStorage.setItem('abrahamic.notes.v1', JSON.stringify([{ href: 'https://evil.example', label: 'x', text: 'y', at: 1 }])))
  await page.goto('/notebook')
  await expect(page.getByText('https://evil.example')).toHaveCount(0)
  expect(sent).toBe(0)
  await done()
})

test('known limits stay visible where a visitor could be misled', async ({ page }) => {
  await page.goto('/daily')
  await expect(page.getByText(/new questions begin at midnight UTC/i)).toBeVisible()
  await expect(page.getByText(/streak counts your own local days/i)).toBeVisible()
  await page.goto('/web')
  await expect(page.getByText(/built from themes/i)).toBeVisible()
  await expect(page.getByText(/not the full list of ideas/i)).toBeVisible()
  await page.goto('/map')
  await expect(page.getByText(/locations are approximate/i)).toBeVisible()
  await page.goto('/comparisons')
  const first = await page.locator('a[href^="/comparisons/"]').first().getAttribute('href')
  await page.goto(first!)
  await expect(page.getByText(/does not mean\s+the traditions disagree/i).first()).toBeVisible()
})
