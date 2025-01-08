import { test, expect } from "playwright/test";
test("redirection to sign in if not signed in", async ({ page }) => {
  let urls = ["profile", "signout", "changepassword"];

  for (const url of urls) {
    await page.goto(`http://localhost:3000/user/${url}`);
    await page.waitForURL(
      `http://localhost:3000/user/signin?returnUrl=/user/${url}`
    );
  }
});
