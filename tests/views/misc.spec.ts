import { test, expect } from 'playwright-test-coverage';
import { CONFIG } from './test.config';

test('test about page', async ({ page }) => {
    await page.goto(`${CONFIG.ORIGIN}/about`);
    await expect(page.getByText("The secret sauce")).toBeVisible();
});

test('test docs page', async ({ page }) => {
    await page.goto(`${CONFIG.ORIGIN}/docs`);
    await expect(page.getByText("JWT Pizza API")).toBeVisible();
});

test('test history page', async ({ page }) => {
    await page.goto(`${CONFIG.ORIGIN}/history`);
    await expect(page.getByText("Mama Rucci, my my")).toBeVisible();
});