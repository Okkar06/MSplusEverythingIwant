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

test.describe("unlinking", () => {
  test("asks first, and keeping the link changes nothing", async ({ page, supabase }) => {
    await page.goto("/");
    const card = page.getByRole("region", { name: "Unlink" });
    await card.getByRole("button", { name: "Unlink…" }).click();
    await expect(card.getByText("Unlink from Ben?")).toBeVisible();
    await card.getByRole("button", { name: "Keep linked" }).click();
    await expect(card.getByText("Linked with Ben")).toBeVisible();
    expect(supabase.profiles[ME].partner_id).toBe(PARTNER);
    expect(supabase.requests.some((r) => r.url().endsWith("/rpc/unpair"))).toBe(false);
  });

  test("unlinking goes back to the waiting screen and stops sharing", async ({ page, supabase }) => {
    await page.addInitScript(() => localStorage.setItem("share-location", "on"));
    await page.goto("/");
    const card = page.getByRole("region", { name: "Unlink" });
    await card.getByRole("button", { name: "Unlink…" }).click();
    await card.getByRole("button", { name: "Unlink", exact: true }).click();

    await expect(page.getByRole("heading", { name: "Almost there" })).toBeVisible();
    expect(supabase.profiles[ME].partner_id).toBeNull();
    expect(await page.evaluate(() => localStorage.getItem("share-location"))).toBe("off");
  });

  test("unlinking clears your mood note and reaction, but keeps your mood", async ({ page, supabase }) => {
    supabase.setMood(ME, "loved", "miss you Ben");
    supabase.reactions[ME] = { user_id: ME, kind: "hug", sent_at: new Date().toISOString() };
    await page.goto("/");
    const card = page.getByRole("region", { name: "Unlink" });
    await expect(card.getByText(/mood notes are cleared/)).toHaveCount(0);
    await card.getByRole("button", { name: "Unlink…" }).click();
    await expect(card.getByText(/latest reactions are deleted, and your mood notes are cleared/)).toBeVisible();
    await card.getByRole("button", { name: "Unlink", exact: true }).click();

    await expect(page.getByRole("heading", { name: "Almost there" })).toBeVisible();
    expect(supabase.moods[ME]).toMatchObject({ mood: "loved", note: null });
    expect(supabase.reactions[ME]).toBeUndefined();
  });

  test("when the partner unlinks, the screen moves on by itself", async ({ page, supabase }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "You & Ben" })).toBeVisible();
    supabase.benUnlinks();
    await expect(page.getByRole("heading", { name: "Almost there" })).toBeVisible();
  });
});
