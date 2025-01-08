import { test, expect } from "playwright/test";
test("has link do login page", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.click("#sign-in");
  await expect(page).toHaveURL("http://localhost:3000/user/signin");
  await expect(page.locator("h1")).toContainText("Sign in");
});
