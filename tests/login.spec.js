import { test, expect } from "playwright/test";
test("can login and go to profile", async ({ page }) => {
  await page.goto("http://localhost:3000/user/signin");
  await page.getByPlaceholder("Email").fill("tomczyk.hubert22@gmail.com");
  await page.getByPlaceholder("Password").fill("Admin123");
  await page.getByTestId("submit-button").click();
  await expect(page).toHaveURL("http://localhost:3000");
  await page.click("#profile");
  await expect(page).toHaveURL("http://localhost:3000/user/profile");
});
