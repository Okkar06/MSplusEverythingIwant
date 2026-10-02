import { expect, test } from "./fake-supabase";

test("signs in with an emailed code", async ({ page, supabase }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Hello, you two" })).toBeVisible();

  await page.getByLabel("Email").fill("ana@example.com");
  await page.getByLabel("Your name").fill("Ana");
  await page.getByRole("button", { name: "Send sign-in email" }).click();

  await expect(page.getByText("Check ana@example.com")).toBeVisible();
  const otp = supabase.requests.find((r) => r.url().includes("/auth/v1/otp"));
  expect(otp?.postDataJSON()).toMatchObject({ email: "ana@example.com", data: { display_name: "Ana" } });

  await page.getByLabel("Code").fill("123456");
  await page.getByRole("button", { name: "Sign in" }).click();

  // Signed in but not linked yet.
  await expect(page.getByRole("heading", { name: "Almost there" })).toBeVisible();
  const verify = supabase.requests.find((r) => r.url().includes("/auth/v1/verify"));
  expect(verify?.postDataJSON()).toMatchObject({ email: "ana@example.com", token: "123456", type: "email" });
});

// Regression: going back used to re-submit the email form and send a second email.
test("can go back and use a different email", async ({ page, supabase }) => {
  await page.goto("/");
  await page.getByLabel("Email").fill("typo@example.com");
  await page.getByRole("button", { name: "Send sign-in email" }).click();
  await page.getByRole("button", { name: "Use a different email" }).click();
  await expect(page.getByRole("button", { name: "Send sign-in email" })).toBeVisible();
  await expect(page.getByLabel("Email")).toHaveValue("typo@example.com");
  expect(supabase.requests.filter((r) => r.url().includes("/auth/v1/otp"))).toHaveLength(1);
});
