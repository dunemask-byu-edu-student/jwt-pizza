import { test, expect } from 'playwright-test-coverage';
import { CONFIG } from './test.config';

test('home page', async ({ page }) => {
    await page.goto(CONFIG.ORIGIN);
    expect(await page.title()).toBe('JWT Pizza');
});