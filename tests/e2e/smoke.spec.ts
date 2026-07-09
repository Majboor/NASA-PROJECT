import { test, expect, type Page } from '@playwright/test'

// The landing page shows a ~2s loading screen, then may pop a guide modal.
async function dismissOverlays(page: Page) {
  const closeGuide = page.getByRole('button', { name: 'Close guide' })
  try {
    await closeGuide.click({ timeout: 8000 })
  } catch {
    // Guide modal not shown (or already closed) — fine.
  }
}

test.describe('landing page', () => {
  test('loads and renders the hero after the loading screen', async ({ page }) => {
    await page.goto('/')

    // Hero heading appears once the loading screen (~2s) completes.
    await expect(page.getByRole('heading', { name: /Imagine the Future/i })).toBeVisible({
      timeout: 15000,
    })
    await dismissOverlays(page)

    // The hero renders a mobile and a desktop copy; only one is visible per viewport.
    await expect(
      page.getByText('AI-Powered Space Habitat Design').filter({ visible: true }).first(),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /Explore More/i }).filter({ visible: true }).first(),
    ).toBeVisible()
  })

  test('exposes a navigation entry into the designer app', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Imagine the Future/i })).toBeVisible({
      timeout: 15000,
    })
    await dismissOverlays(page)

    // "Prompt Now" nav link points at /app.
    const appLink = page.getByRole('link', { name: 'Prompt Now' })
    await expect(appLink).toHaveAttribute('href', /\/app/)
  })
})

test.describe('habitat designer (/app)', () => {
  test('renders the questionnaire welcome and mission destination options', async ({ page }) => {
    await page.goto('/app/')

    await expect(page.getByText(/Welcome to Voronova Space Habitat Designer/i)).toBeVisible({
      timeout: 15000,
    })

    for (const opt of ['Mars Transit', 'Lunar Surface', 'Deep Space', 'Asteroid Mining']) {
      await expect(page.getByText(opt, { exact: true }).first()).toBeVisible()
    }
  })

  test('advances the questionnaire when a destination is chosen', async ({ page }) => {
    await page.goto('/app/')
    await expect(page.getByText(/Welcome to Voronova Space Habitat Designer/i)).toBeVisible({
      timeout: 15000,
    })

    await page.getByText('Mars Transit', { exact: true }).first().click()

    // The selection is echoed as a user message and the next question appears.
    await expect(page.getByText('Selected: Mars Transit').first()).toBeVisible()
    await expect(page.getByText(/What is your crew size\?/i)).toBeVisible()
  })
})
