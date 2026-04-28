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

test('home page renders the new narrative sections and how-it-works steps in order', async ({ page }) => {
  await page.goto('/')

  const levelTwoHeadings = await page.locator('main h2').evaluateAll(nodes =>
    nodes
      .map(node => node.textContent?.replace(/\s+/g, ' ').trim())
      .filter((value): value is string => Boolean(value))
  )

  const expectedSequence = [
    'A track record built on execution.',
    'Sports is booming. Access is the problem.',
    'We turn sports opportunities into investor-ready deals.',
    'Underwritten like real estate. Operated like sports. Structured for investors.',
    'How it works',
    'Structured deals. Serious returns.'
  ]

  let lastIndex = -1

  for (const heading of expectedSequence) {
    const currentIndex = levelTwoHeadings.indexOf(heading)

    expect(currentIndex, `Missing heading: ${heading}`).toBeGreaterThan(lastIndex)
    lastIndex = currentIndex
  }

  await expect(page.locator('#mechanism p').first()).toHaveText('Every opportunity is reviewed through the lens of:')

  await expect(page.locator('#process h3')).toHaveText([
    'Review active opportunities',
    'Request the investor materials',
    'Evaluate the fit',
    'Invest with clarity'
  ])
})
