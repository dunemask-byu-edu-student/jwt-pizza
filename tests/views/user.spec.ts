import { test, expect } from "playwright-test-coverage";
import { createNewDinerAndLogin, login, logout } from "../util";
import { CONFIG } from "./test.config";

test("user update self", async ({ page }) => {
  await createNewDinerAndLogin(page);
  await page.waitForTimeout(500); // Loading a page too quickly after creating a new diner causes a state inconsistency
  await page.goto(`${CONFIG.ORIGIN}/diner-dashboard`, {
    waitUntil: "domcontentloaded",
  });
  const newName = "potato2";
  await page.waitForSelector('[role="dialog"].hidden', { state: "attached" });
  await page.getByRole("button", { name: "Edit" }).click();
  await expect(page.locator("h3")).toContainText("Edit user");
  await page.getByRole("textbox").first().fill(newName);
  await page.getByRole("button", { name: "Update" }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: "attached" });

  await expect(page.getByRole("main")).toContainText(newName);
});

test("list and delete users", async ({ page }) => {
  const { name, email } = await createNewDinerAndLogin(page);
  await logout(page);
  for (let i = 0; i < 10; i++) {
    await createNewDinerAndLogin(page); // Create enough users to require pargination
    await logout(page);
  }
  await login(page, CONFIG.ADMIN_EMAIL, CONFIG.ADMIN_PASSWORD);
  await page.goto(`${CONFIG.ORIGIN}/admin-dashboard`, {
    waitUntil: "domcontentloaded",
  });

  // Wait for the Users table to be visible
  await page.getByRole("heading", { name: "Users" }).waitFor();

  const usersSection = page
    .getByRole("heading", { name: "Users" })
    .locator("..")
    .locator("..");
  // We go up a few levels to the container wrapping the table and buttons

  // Now find buttons inside the usersSection
  const nextButton = usersSection.getByRole("button", { name: ">" });
  const prevButton = usersSection.getByRole("button", { name: "<" });

  // Click pagination buttons inside the user section
  await nextButton.click();
  await page.waitForTimeout(500);
  await prevButton.click();
  await page.waitForTimeout(500);

  // Search for the user (using the email as the name)
  const searchInput = page.getByPlaceholder("Filter by name");
  await searchInput.fill(name);
  await page.getByRole("button", { name: "Search" }).click();

  // Wait for the user to appear in the table
  const userRow = page.getByRole("row", { name: new RegExp(name, "i") });
  await expect(userRow).toBeVisible();

  // Click delete button in that row
  const deleteButton = userRow.getByRole("button", { name: /delete/i });
  await deleteButton.click();

  // Optionally: wait for refresh
  await page.waitForTimeout(2000);
  await searchInput.fill(name);
  await page.getByRole("button", { name: "Search" }).click();

  // Ensure user is no longer in the list
  await expect(
    page.getByRole("row", { name: new RegExp(name, "i") })
  ).toHaveCount(1); // Controls are considered a row item
});
