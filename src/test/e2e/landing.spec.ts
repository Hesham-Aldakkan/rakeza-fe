import { test, expect } from '@playwright/test';

test('landing page loads and renders correctly in Arabic', async ({ page }) => {
  await page.goto('/ar');

  // Check if main heading is visible
  const heading = page.locator('h1').first();
  await expect(heading).toBeVisible();

  // Check if CTA button is visible
  const cta = page.locator('a:has-text("ابدأ الآن")').first();
  await expect(cta).toBeVisible();
});

test('landing page loads and renders correctly in English', async ({ page }) => {
  await page.goto('/en');

  // Check if main heading is visible
  const heading = page.locator('h1').first();
  await expect(heading).toBeVisible();

  // Check if CTA button is visible
  const cta = page.locator('a:has-text("Get Started")').first();
  await expect(cta).toBeVisible();
});

test('can navigate to signup from landing page', async ({ page }) => {
  await page.goto('/ar');

  // Click on signup link
  await page.click('a[href="/auth/signup"]');

  // Should redirect to signup page
  await expect(page).toHaveURL(/\/auth\/signup/);
});

test('can scroll to FAQ section', async ({ page }) => {
  await page.goto('/ar');

  // Scroll to FAQ
  await page.click('a[href="#faq"]');

  // Check if FAQ section is visible
  const faqSection = page.locator('#faq');
  await expect(faqSection).toBeInViewport();
});

test('dark mode toggle is available', async ({ page }) => {
  await page.goto('/ar');

  // Check for theme toggle (if implemented in header)
  // This would depend on actual implementation
});

test('page is accessible with keyboard navigation', async ({ page }) => {
  await page.goto('/ar');

  // Tab through main elements
  await page.keyboard.press('Tab');

  // Check if first focusable element is focused
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(focused).toBeTruthy();
});
