import { expect, PARTNER, test, ME } from "./fake-supabase";

test.beforeEach(async ({ context, supabase }) => {
  supabase.link();
  supabase.setMood(PARTNER, "calm", "Reading in the sun");
  await supabase.signIn(context);
});

test("shows both of you, with the partner's mood", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "You & Ben" })).toBeVisible();

  const theirs = page.getByRole("region", { name: "Ben's current mood" });
  await expect(theirs.getByText("Calm")).toBeVisible();
  await expect(theirs.getByText("“Reading in the sun”")).toBeVisible();
  await expect(page.getByRole("region", { name: "Your current mood" }).getByText("No mood yet")).toBeVisible();
});

test("picking a mood saves it and shows it", async ({ page, supabase }) => {
  await page.goto("/");
  const happy = page.getByRole("radio", { name: "Happy" });
  await happy.click();

  await expect(happy).toHaveAttribute("aria-checked", "true");
  await expect(page.getByRole("region", { name: "Your current mood" }).getByText("Happy")).toBeVisible();
  await expect.poll(() => supabase.moods[ME]?.mood).toBe("happy");
});

test("the partner's new mood arrives over Realtime", async ({ page, supabase }) => {
  await page.goto("/");
  const theirs = page.getByRole("region", { name: "Ben's current mood" });
  await expect(theirs.getByText("Calm")).toBeVisible();

  supabase.push("moods", "UPDATE", supabase.setMood(PARTNER, "missing_you"));
  await expect(theirs.getByText("Missing you")).toBeVisible();
  await expect(theirs.getByText("Calm")).toHaveCount(0);
});

test("renaming yourself saves the new name", async ({ page, supabase }) => {
  await page.goto("/");
  const name = page.getByLabel("Your name");
  await name.fill("Ana B");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Saved.")).toBeVisible();
  expect(supabase.profiles[ME].display_name).toBe("Ana B");
});

test("signing out goes back to the sign-in screen", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "You & Ben" })).toBeVisible();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("heading", { name: "Hello, you two" })).toBeVisible();
});
