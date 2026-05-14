import { expect, test } from "@playwright/test";

test("admin terms page blocks publishing controls without an admin session", async ({ page }) => {
  await page.goto("/admin/terms");

  await expect(page.getByRole("heading", { name: "Manage drafts and published entries." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sign in before managing terms." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Go to sign-in" })).toHaveAttribute("href", "/sign-in");
});

test("admin checks dashboard blocks unauthenticated check runs", async ({ page }) => {
  await page.goto("/admin/checks");

  await expect(page.getByRole("heading", { name: "Run and understand site checks." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sign in before running checks." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Run all checks" })).toHaveCount(0);
});

test("new term page previews the form but blocks unauthenticated saves", async ({ page }) => {
  await page.goto("/admin/terms/new");

  await expect(page.getByRole("heading", { name: "Submit a new term." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "You are not signed in as an allowlisted admin." })).toBeVisible();
  await expect(page.getByLabel("Term name")).toBeVisible();

  await page.getByRole("button", { name: "save draft" }).click();

  await expect(page.getByText("Submission blocked")).toBeVisible();
  await expect(page.getByText("Admin sign-in is required before a term can be saved.")).toBeVisible();
});
