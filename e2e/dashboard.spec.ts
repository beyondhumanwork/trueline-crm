import { test, expect } from "@playwright/test";

test.describe("Auth Redirect", () => {
  test("redirects unauthenticated users from dashboard to login", async ({ page }) => {
    // Navigate directly to a protected route
    await page.goto("/dashboard");

    // The middleware should redirect to /login when no session exists
    await expect(page).toHaveURL(/\/login/);

    // Verify the login page renders
    await expect(page.getByText("TrueLine CRM")).toBeVisible();
  });

  test("redirects unauthenticated users from contacts page to login", async ({ page }) => {
    await page.goto("/contacts");

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText("TrueLine CRM")).toBeVisible();
  });
});
