import { test, expect } from "@playwright/test";

test("home opens login in Thai and language survives navigation and reload", async ({
  page,
  isMobile,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "th");
  await expect(
    page.getByRole("button", { name: "เข้าสู่ระบบด้วย Google", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "ภาษาไทย", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({
    path: `docs/screenshots/login-th-${isMobile ? "mobile" : "desktop"}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Continue with Google", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Explore the public demo", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your next chapter starts here." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "ภาษาไทย", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "วันนี้มาเก่งอังกฤษขึ้นอีกนิด." }),
  ).toBeVisible();
  await expect(
    page.getByText("คะแนนสะสมจากการเรียน", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("เป้าหมายวันนี้", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "th");
  await expect(
    page.getByRole("button", { name: "ภาษาไทย", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({
    path: `docs/screenshots/dashboard-th-${isMobile ? "mobile" : "desktop"}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("heading", { name: "Your next chapter starts here." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("changing UI language retains onboarding and assessment answers while exercises stay English", async ({
  page,
}) => {
  await page.goto("/demo/onboarding");
  await page.getByLabel("อยากให้เราเรียกคุณว่าอะไร?").fill("นก");
  await page.getByLabel("ท่องเที่ยว", { exact: true }).check();
  await page.getByLabel("เทคโนโลยี", { exact: true }).check();
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.getByLabel("What should we call you?")).toHaveValue("นก");
  await expect(page.getByLabel("Travel", { exact: true })).toBeChecked();
  await page
    .getByRole("button", { name: "Find my starting point", exact: true })
    .click();
  await page.getByRole("button", { name: "I'm ready to begin" }).click();
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Next question" }).click();
  await expect(
    page.getByText("Question 2 of 18", { exact: true }),
  ).toBeVisible();
  const prompt = await page.locator(".question-card h2").textContent();
  await page.getByRole("button", { name: "ภาษาไทย", exact: true }).click();
  await expect(page.getByText("ข้อ 2 จาก 18", { exact: true })).toBeVisible();
  await expect(page.locator(".question-card h2")).toHaveText(prompt!);
  await expect(page.locator(".question-card h2")).toHaveAttribute("lang", "en");
  await page.reload();
  await expect(page.getByText("ข้อ 2 จาก 18", { exact: true })).toBeVisible();
});
