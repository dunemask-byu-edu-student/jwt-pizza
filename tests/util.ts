import { Page } from "@playwright/test";
import { CONFIG } from "./views/test.config";
import { expect } from "playwright-test-coverage";

export const randomSlug = () => Math.random().toString(36).substring(2);

export async function createNewDinerAndLogin(page: Page){
    const slug = randomSlug();
    const name = `Full name '${slug}'`;
    const email = `pw-${slug}+${Date.now()}@test.com`;
    const password = slug;
    await page.goto(CONFIG.ORIGIN, {waitUntil: "domcontentloaded"});
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('main').getByText('Register').click();
    await page.getByRole('textbox', { name: 'Full name' }).fill(name);
    await page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Register' }).click();
    return {name, email, password};
}

export async function login(page: Page, email: string, password: string, timeout = CONFIG.TIMEOUTS.xl){
        await page.goto(CONFIG.ORIGIN, {waitUntil: "domcontentloaded"});
        await page.waitForTimeout(timeout);
        await page.getByRole('link', { name: 'Login' }).click();
        await page.getByRole('textbox', { name: 'Email address' }).click();
        await page.getByRole('textbox', { name: 'Email address' }).fill(email);
        await page.getByRole('textbox', { name: 'Password' }).fill(password);
        await page.getByRole('button', { name: 'Login' }).click();
        await page.waitForTimeout(timeout);
}

async function logout(page: Page) {
  const logoutLink = page.getByRole('link', { name: 'Logout' });
  if (await logoutLink.count() > 0) await logoutLink.click();
}

export async function createFranchise(page: Page, loginFranchise = false){
        const { email, password } = await createNewDinerAndLogin(page);
        const franchiseName = `${email} franchise`;
        await logout(page);
        await page.waitForTimeout(CONFIG.TIMEOUTS.xl);
        await login(page, CONFIG.ADMIN_EMAIL, CONFIG.ADMIN_PASSWORD);
        await page.waitForTimeout(CONFIG.TIMEOUTS.xl);
        await page.goto(`${CONFIG.ORIGIN}/admin-dashboard`, {waitUntil: "domcontentloaded"});
        await page.getByRole('button', { name: 'Add Franchise' }).click();
        await page.getByRole('textbox', { name: 'franchise name' }).fill(franchiseName);
        await page.getByRole('textbox', { name: 'franchisee admin email' }).fill(email);
        await page.getByRole('button', { name: 'Create' }).click();
        await logout(page);
        if(loginFranchise) await login(page, email, password);
        return {email, password, franchiseName};
}

export async function closeFranchise(page: Page, franchiseName: string){
    await login(page, CONFIG.ADMIN_EMAIL, CONFIG.ADMIN_PASSWORD);
    await page.waitForTimeout(CONFIG.TIMEOUTS.xl);
    await page.goto(`${CONFIG.ORIGIN}/admin-dashboard`, {waitUntil: "domcontentloaded"});
    await page.getByTestId(`close-franchise-${franchiseName}`).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await logout(page);
}