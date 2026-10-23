import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  configured: vi.fn(),
  auth: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`);
  }),
}));
vi.mock("@/auth", () => ({
  authConfigured: mocks.configured,
  auth: mocks.auth,
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
import HomePage from "@/app/page";
beforeEach(() => vi.clearAllMocks());
it("opens login without calling the auth backend when setup is incomplete", async () => {
  mocks.configured.mockReturnValue(false);
  await expect(HomePage()).rejects.toThrow("redirect:/login");
  expect(mocks.auth).not.toHaveBeenCalled();
});
it("sends a signed-in learner straight to the protected learner area", async () => {
  mocks.configured.mockReturnValue(true);
  mocks.auth.mockResolvedValue({ user: { id: "learner" } });
  await expect(HomePage()).rejects.toThrow("redirect:/learn");
});
it("requires login for a missing session even when OAuth is configured", async () => {
  mocks.configured.mockReturnValue(true);
  mocks.auth.mockResolvedValue(null);
  await expect(HomePage()).rejects.toThrow("redirect:/login");
});
