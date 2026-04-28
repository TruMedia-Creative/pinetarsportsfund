import { expect, test } from '@playwright/test'

async function expectAboutSectionNearViewportTop(page: Parameters<typeof test>[0]['page']) {
  await page.waitForFunction(() => window.location.hash === '#about')

  const metrics = await page.locator('#about').evaluate((element) => {
    const rect = element.getBoundingClientRect()
    const header = document.querySelector('header')

    return {
      top: rect.top,
      headerHeight: header ? header.getBoundingClientRect().height : 0
    }
  })

  expect(metrics.top).toBeGreaterThanOrEqual(0)
  expect(metrics.top).toBeLessThanOrEqual(Math.max(metrics.headerHeight + 32, 160))
}

test('about navigation smoothly targets the about section from the home page', async ({ page }) => {
  await page.goto('/')

  await page.locator('header').getByRole('link', { name: 'About', exact: true }).click()

  await expect(page).toHaveURL(/\/#about$/)
  await expectAboutSectionNearViewportTop(page)
})

test('about navigation returns to the landing page and targets the about section from investments', async ({ page }) => {
  await page.goto('/investments')

  await page.locator('header').getByRole('link', { name: 'About', exact: true }).click()

  await expect(page).toHaveURL(/\/#about$/)
  await expectAboutSectionNearViewportTop(page)
})
