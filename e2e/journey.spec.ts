import { expect, test } from '@playwright/test'

const course = '/learn/abraham-across-traditions'
const steps = [
  'Meet Abraham',
  'Avraham in Judaism',
  'Abraham in Christianity',
  'Ibrahim in Islam',
  'One figure, distinct traditions',
  'Review the evidence',
]

const answers: { prompt: RegExp; options: string[] }[] = [
  { prompt: /What name is Abraham given in Islamic tradition/, options: ['Ibrahim'] },
  { prompt: /According to Judaism, through whom/, options: ['Isaac and Jacob'] },
  { prompt: /How does Paul use Abraham/, options: ['As a model and father of faith'] },
  { prompt: /How does the Quran describe Ibrahim/, options: ['A hanif who submitted to God'] },
  { prompt: /How do the traditions identify the son/, options: [
    'Judaism: Isaac', 'Christianity: Isaac', 'Islam: Quran unnamed; predominantly Ishmael in later tradition',
  ] },
]

test('a beginner can complete, review, and restart the Abraham journey', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Begin the journey' }).click()

  for (const [index, title] of steps.entries()) {
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)

    if (index === steps.length - 1) break
    await page.getByRole('link', { name: 'Complete & continue' }).first().click()

    if (index === 0) {
      await page.goto(course)
      await expect(page.getByRole('link', { name: /Meet Abraham 2 min · Completed/ })).toBeVisible()
      await expect(page.getByRole('link', { name: /Avraham in Judaism 2 min · (In progress · )?up next/i })).toBeVisible()
      await page.getByRole('link', { name: 'Continue: Avraham in Judaism' }).click()
    }
  }

  await page.getByRole('link', { name: 'Start the final quiz' }).click()
  for (let index = 0; index < 5; index++) {
    const prompt = await page.locator('fieldset legend').innerText()
    const answer = answers.find((item) => item.prompt.test(prompt))
    expect(answer, `Missing answer fixture for: ${prompt}`).toBeDefined()
    for (const option of answer!.options) {
      await page.getByRole(answer!.options.length > 1 ? 'checkbox' : 'radio', { name: option, exact: true }).check()
    }
    await page.getByRole('button', { name: 'Check answer' }).click()
    await expect(page.getByText('Correct', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: index === 4 ? 'See results' : 'Next question' }).click()
  }

  await expect(page.getByRole('heading', { name: '5 out of 5' })).toBeVisible()
  await page.getByRole('link', { name: 'Return to journey map' }).click()
  await expect(page.getByText('6 of 6 steps complete')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Review your journey' })).toBeVisible()

  await page.getByRole('button', { name: 'Restart journey' }).click()
  await expect(page.getByText('0 of 6 steps complete')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Begin the journey' })).toBeVisible()
})
