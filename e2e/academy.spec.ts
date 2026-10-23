import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: "engthai-language",
      value: "en",
      url: "http://localhost:3000",
      sameSite: "Lax",
    },
  ]);
});

test("demo learner can onboard, finish a skills check, complete a lesson, and reload progress", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/demo/onboarding");
  await page.getByLabel("What should we call you?").fill("Nok");
  await page.getByLabel("Travel", { exact: true }).check();
  await page.getByLabel("Work communication", { exact: true }).check();
  await page.getByLabel("Technology", { exact: true }).check();
  await page.getByRole("button", { name: "Find my starting point" }).click();
  await expect(page).toHaveURL(/\/demo\/assessment$/);
  await page.getByRole("button", { name: "I'm ready to begin" }).click();
  await expect(
    page.getByText("Question 1 of 18", { exact: true }),
  ).toBeVisible();
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Next question" }).click();
  await page.reload();
  await expect(
    page.getByText("Question 2 of 18", { exact: true }),
  ).toBeVisible();
  for (let n = 2; n <= 18; n++) {
    await expect(
      page.getByText(`Question ${n} of 18`, { exact: true }),
    ).toBeVisible();
    await page.getByRole("radio").first().check();
    await page
      .getByRole("button", {
        name: n === 18 ? "See my results" : "Next question",
      })
      .click();
  }
  await expect(page).toHaveURL(/\/demo\/results$/);
  await expect(page.getByText(/3 of 6 skill areas checked/)).toBeVisible();
  await expect(
    page.getByText("Not assessed · additional assessment needed"),
  ).toHaveCount(3);
  await page.goto("/demo/lesson/sentence-foundations");
  await page.getByRole("button", { name: "Let's practise" }).click();
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Check my answer" }).click();
  await expect(
    page.getByText("Nearly there. Give it another try."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Complete lesson/ }),
  ).toHaveCount(0);
  await page.getByRole("radio").nth(1).check();
  await page.getByRole("button", { name: "Check my answer" }).click();
  await page.getByRole("button", { name: "Complete lesson · +30 XP" }).click();
  await expect(page).toHaveURL(/\/demo\/dashboard$/);
  await page.reload();
  await expect(page.getByText("Hello, Nok")).toBeVisible();
  await expect(
    page.locator(".stat-card").filter({ hasText: "total learning XP" }),
  ).toContainText("30");
  await page.goto("/demo/lesson/sentence-foundations");
  await page.getByRole("button", { name: "Let's practise" }).click();
  await page.getByRole("radio").nth(1).check();
  await page.getByRole("button", { name: "Check my answer" }).click();
  await page.getByRole("button", { name: "Finish review" }).click();
  await expect(
    page.locator(".stat-card").filter({ hasText: "total learning XP" }),
  ).toContainText("30");
  expect(errors).toEqual([]);
});

test("protected routes fail closed without an authenticated session", async ({
  page,
  request,
}) => {
  await page.goto("/learn/settings");
  await expect(page).toHaveURL(/\/login/);
  await expect(
    page.getByRole("button", { name: "Continue with Google" }),
  ).toBeVisible();
  const response = await request.get("/api/auth/session");
  expect([200, 503]).toContain(response.status());
  expect(response.headers()["cache-control"]).toContain("no-store");
});

test("public screens fit the viewport and theme, navigation and vocabulary work", async ({
  page,
  isMobile,
}) => {
  for (const route of [
    "/",
    "/login",
    "/welcome",
    "/demo",
    "/demo/lessons",
    "/demo/grammar",
    "/demo/tutor",
    "/demo/progress",
    "/demo/settings",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    if (route === "/demo")
      await page.screenshot({
        path: `docs/screenshots/dashboard-${isMobile ? "mobile" : "desktop"}.png`,
        fullPage: true,
      });
    if (route === "/welcome")
      await page.screenshot({
        path: `docs/screenshots/welcome-${isMobile ? "mobile" : "desktop"}.png`,
        fullPage: true,
      });
  }
  await page.goto("/demo/vocabulary");
  await page.getByRole("button", { name: "Reveal meaning" }).click();
  await expect(page.locator(".flashcard .translation")).toHaveText("ยืม");
  await expect(page.getByText("0 to review · 10 new")).toBeVisible();
  await page.getByRole("button", { name: "I remembered" }).click();
  await expect(page.getByText("0 to review · 9 new")).toBeVisible();
  await expect(
    page.getByText("1/10 new words today", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator(".academy")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator(".academy")).toHaveClass(/dark/);
  await page.screenshot({
    path: `docs/screenshots/vocabulary-dark-${isMobile ? "mobile" : "desktop"}.png`,
    fullPage: true,
  });
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("link", { name: "My progress", exact: true }).click();
    await expect(page).toHaveURL(/\/demo\/progress$/);
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toHaveAttribute("aria-expanded", "false");
  }
});

test("PWA caches only public assets and offers an offline fallback", async ({
  page,
  context,
}) => {
  await page.goto("/demo");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await page.goto("/login");
  const cachePaths = await page.evaluate(async () => {
    const keys = (await caches.keys()).filter((key) =>
      key.startsWith("engthai-public-"),
    );
    const paths: string[] = [];
    for (const key of keys)
      for (const request of await (await caches.open(key)).keys())
        paths.push(new URL(request.url).pathname);
    return paths;
  });
  expect(cachePaths).toContain("/offline.html");
  expect(
    cachePaths.every(
      (path) =>
        path === "/offline.html" ||
        path === "/icon.svg" ||
        path.startsWith("/icons/"),
    ),
  ).toBe(true);
  await context.setOffline(true);
  await page.goto("/learn/settings");
  await expect(
    page.getByRole("heading", { name: "A little pause in your journey." }),
  ).toBeVisible();
  await context.setOffline(false);
});

test("damaged progress is preserved until an explicit reset", async ({
  page,
}) => {
  await page.goto("/demo");
  await page.evaluate(() =>
    localStorage.setItem("engthai:v1:public-demo", "{damaged"),
  );
  await page.reload();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "couldn't read your saved progress",
  );
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("engthai:v1:public-demo")),
    )
    .toBe("{damaged");
  await page.getByRole("link", { name: "Open Settings", exact: true }).click();
  await page
    .getByRole("button", { name: "Reset browser progress", exact: true })
    .click();
  await page.getByRole("button", { name: "Keep my progress" }).click();
  expect(
    await page.evaluate(() => localStorage.getItem("engthai:v1:public-demo")),
  ).toBe("{damaged");
  await page
    .getByRole("button", { name: "Reset browser progress", exact: true })
    .click();
  await page.getByRole("button", { name: "Yes, reset my progress" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveCount(0);
  expect(
    await page.evaluate(() => localStorage.getItem("engthai:v1:public-demo")),
  ).toBeNull();
});
