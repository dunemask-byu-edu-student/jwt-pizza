import { test, expect } from "playwright-test-coverage";
import {
  closeFranchise,
  createFranchise,
  createNewDinerAndLogin,
  login,
  randomSlug,
} from "../util";
import { Page } from "@playwright/test";
import { CONFIG } from "./test.config";

async function logout(page: Page) {
  await page.getByRole("link", { name: "Logout" }).click();
}

test("login", async ({ page }) => {
  const { email, password } = await createNewDinerAndLogin(page);
  await logout(page);
  await login(page, email, password);
  await expect(page.getByRole("link", { name: "Logout" })).toBeVisible();
});

test("register", async ({ page }) => {
  await createNewDinerAndLogin(page);
});

test("login admin", async ({ page }) => {
  await login(page, CONFIG.ADMIN_EMAIL, CONFIG.ADMIN_PASSWORD);
  await expect(page.getByRole("link", { name: "Admin" })).toBeVisible();
});

test("open & close franchise", async ({ page }) => {
  const { franchiseName } = await createFranchise(page);
  await closeFranchise(page, franchiseName);
});

test("open & close store", async ({ page }) => {
  const { email, password, franchiseName } = await createFranchise(page);
  const storeName = `${franchiseName} - store ${randomSlug()}`;
  await page.goto(CONFIG.ORIGIN, { waitUntil: "domcontentloaded" });
  await login(page, email, password);
  await page.goto(`${CONFIG.ORIGIN}/franchise-dashboard`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("button", { name: "Create" }).click();
  await page.getByRole("textbox", { name: "store name" }).fill(storeName);
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByText(storeName)).toBeVisible();
  await logout(page);
  await login(page, CONFIG.ADMIN_EMAIL, CONFIG.ADMIN_PASSWORD);
  await page.goto(`${CONFIG.ORIGIN}/admin-dashboard`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByText(storeName)).toBeVisible();
  await logout(page);
  await closeFranchise(page, franchiseName);
});
