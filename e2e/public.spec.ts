import { expect, test } from "@playwright/test";

test("homepage renders the feed and supports search", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Understand the language developers actually use." }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /Fresh entries from the codetionary|Results for/ })).toBeVisible();

  await page.getByRole("main").getByLabel("Search terms").fill("oauth");
  await page.getByRole("main").getByRole("button", { name: "search" }).click();

  await expect(page).toHaveURL(/\/\?q=oauth$/);
  await expect(page.getByRole("heading", { name: 'Results for "oauth"' })).toBeVisible();
});

test("term detail pages expose deeper explanations and related exploration", async ({ page }) => {
  await page.goto("/term/sql-injection");

  await expect(page.getByRole("heading", { level: 1, name: "SQL Injection" })).toBeVisible();
  await expect(page.getByText("term detail")).toBeVisible();
  await expect(page.getByText("OWASP SQL Injection Prevention Cheat Sheet")).toBeVisible();
});

test("category and subtopic pages render browsable term collections", async ({ page }) => {
  await page.goto("/category/databases");

  await expect(page.getByRole("heading", { name: "databases" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Filter this category." })).toBeVisible();

  await page.goto("/category/databases/sql");

  await expect(page.getByRole("heading", { level: 1, name: "sql" })).toBeVisible();
  await expect(page.getByText("Published terms tagged with databases / sql.")).toBeVisible();
});

test("health endpoint returns service status JSON", async ({ request }) => {
  const response = await request.get("/health");

  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toMatch(/application\/json/);
  await expect(response.json()).resolves.toMatchObject({
    ok: true,
    service: "urban-codetionary",
  });
});
