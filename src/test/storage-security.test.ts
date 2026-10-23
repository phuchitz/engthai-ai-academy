import { beforeEach, describe, expect, it } from "vitest";
import { browserRepository, parseProgress } from "@/lib/storage";
import { emptyLearnerState, preferencesSchema } from "@/lib/models";
import { safeRedirect } from "@/lib/security";
describe("browser progress boundaries", () => {
  beforeEach(() => localStorage.clear());
  it("isolates accounts and the public demo, including resets", () => {
    const alice = browserRepository(localStorage, "alice");
    const bob = browserRepository(localStorage, "bob");
    const demo = browserRepository(localStorage, "public-demo");
    const state = emptyLearnerState();
    state.preferences = {
      displayName: "Alice",
      goals: ["Travel", "Work communication"],
      dailyMinutes: 15,
      topics: ["Travel & culture"],
      motivation: "",
    };
    alice.save(state);
    demo.save(state);
    expect(alice.load().preferences?.displayName).toBe("Alice");
    expect(bob.load().preferences).toBeNull();
    alice.clear();
    expect(alice.load().preferences).toBeNull();
    expect(demo.load().preferences?.displayName).toBe("Alice");
  });
  it("does not silently overwrite malformed or incompatible saved data", () => {
    expect(() => parseProgress("{oops")).toThrow();
    expect(() => parseProgress('{"version":999}')).toThrow(
      "incompatible or damaged",
    );
    expect(() =>
      parseProgress(
        JSON.stringify({
          ...emptyLearnerState(),
          assessment: { id: "x", startedAt: "yesterday", answers: [] },
        }),
      ),
    ).toThrow();
    expect(parseProgress(null)).toEqual(emptyLearnerState());
  });
  it("propagates unavailable storage rather than claiming progress was saved", () => {
    const blocked = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("quota");
      },
      removeItem: () => {
        throw new Error("blocked");
      },
    };
    const repo = browserRepository(blocked, "x");
    expect(() => repo.load()).toThrow("blocked");
    expect(() => repo.save(emptyLearnerState())).toThrow("quota");
    expect(() => repo.clear()).toThrow("blocked");
  });
  it("rejects empty and unrecognized preferences", () => {
    expect(
      preferencesSchema.safeParse({
        displayName: " ",
        goals: [],
        dailyMinutes: 999,
        topics: [],
        motivation: "",
      }).success,
    ).toBe(false);
  });
});
describe("safe authentication redirects", () => {
  const base = "https://academy.example";
  it.each([
    "https://evil.example/learn",
    "//evil.example/learn",
    "javascript:alert(1)",
    "https://academy.example.evil.test/",
    "https://academy.example@evil.test/",
    "https://academy.example:444/",
    "http://academy.example/",
    "https://[invalid",
  ])("rejects external or malformed redirect %s", (url) => {
    expect(safeRedirect(url, base)).toBe(`${base}/learn`);
  });
  it("retains local paths, queries and fragments", () => {
    expect(safeRedirect("/learn?tab=grammar#today", base)).toBe(
      `${base}/learn?tab=grammar#today`,
    );
    expect(safeRedirect(`${base}/learn`, base)).toBe(`${base}/learn`);
  });
});
