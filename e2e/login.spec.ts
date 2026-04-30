import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test("renders login form with email input and sign in button", async ({ page }) => {
    await page.goto("/login");

    // Verify the page renders with the CRM branding
    await expect(page.getByText("TrueLine CRM")).toBeVisible();
    await expect(page.getByText("Sign in with email magic link")).toBeVisible();

    // Verify email input exists and is usable
    const emailInput = page.getByLabel("Email");
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEnabled();

    // Fill email and verify it accepts input
    await emailInput.fill("test@example.com");
    await expect(emailInput).toHaveValue("test@example.com");

    // Verify sign in button is present and enabled
    const signInButton = page.getByRole("button", { name: "Sign in" });
    await expect(signInButton).toBeVisible();
    await expect(signInButton).toBeEnabled();
  });

  test("shows error when Supabase is unreachable", async ({ page }) => {
    await page.goto("/login");

    // Fill in email and submit
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByRole("button", { name: "Sign in" }).click();

    // Since Supabase won't be reachable in test env, verify an error is shown
    // Use role-based selector to avoid matching Next.js dev overlay
    await expect(page.getByRole("paragraph").filter({ hasText: "Failed to fetch" })).toBeVisible();

    // Verify the button is re-enabled after the error
    await expect(page.getByRole("button", { name: "Sign in" })).toBeEnabled();
  });

  test("error state allows resubmission", async ({ page }) => {
    await page.goto("/login");

    // Submit first email (will fail)
    await page.getByLabel("Email").fill("first@example.com");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("paragraph").filter({ hasText: "Failed to fetch" })).toBeVisible();

    // Clear and resubmit with different email
    const emailInput = page.getByLabel("Email");
    await emailInput.fill("");
    await emailInput.fill("second@example.com");
    await expect(emailInput).toHaveValue("second@example.com");

    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("paragraph").filter({ hasText: "Failed to fetch" })).toBeVisible();
  });
});
