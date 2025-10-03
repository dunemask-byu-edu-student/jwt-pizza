import { test, expect } from 'playwright-test-coverage';
import { CONFIG } from './test.config';

test('home page', async ({ page }) => {
    await page.goto(CONFIG.ORIGIN, {waitUntil: "domcontentloaded"});
    expect(await page.title()).toBe('JWT Pizza');
});