import { expect, test } from '@playwright/test';

test.describe('Reduced-motion accessibility', () => {
  test.use({ reducedMotion: 'reduce' });

  test('homepage key sections are visible with reduced motion', async ({ page }) => {
    await page.goto('/');

    await test.step('hero headline is visible', async () => {
      const hero = page.getByRole('main').locator('h1').first();
      await expect(hero).toBeVisible();
      const opacity = await hero.evaluate((el) => getComputedStyle(el).opacity);
      expect(parseFloat(opacity)).toBeGreaterThan(0.9);
    });

    await test.step('about section is reachable and visible', async () => {
      await page.goto('/#about');
      const aboutSection = page.locator('#about');
      await expect(aboutSection).toBeVisible();
    });

    await test.step('narrative sections are not hidden', async () => {
      await page.goto('/');
      const headings = page.locator('main h2');
      const count = await headings.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const heading = headings.nth(i);
        const opacity = await heading.evaluate((el) => getComputedStyle(el).opacity);
        expect(parseFloat(opacity), `h2 index ${i} should not be hidden`).toBeGreaterThan(0.9);
      }
    });
  });

  test('investment listing page is fully visible with reduced motion', async ({ page }) => {
    await page.goto('/investments');

    await test.step('page heading is visible', async () => {
      await expect(
        page.getByRole('heading', { name: 'Active Investment Opportunities' })
      ).toBeVisible();
    });

    await test.step('no content is hidden behind opacity: 0', async () => {
      const main = page.getByRole('main');
      await expect(main).toBeVisible();
      const opacity = await main.evaluate((el) => getComputedStyle(el).opacity);
      expect(parseFloat(opacity)).toBeGreaterThan(0.9);
    });
  });
});
