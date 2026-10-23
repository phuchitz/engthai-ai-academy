import { dayKey } from "./learning";

// In-memory per-account limits for paid AI calls. State lives in one server instance only, so
// serverless cold starts and parallel instances each keep their own counts. Replace with a
// shared store (for example Redis) before relying on it as a hard spending control.
export function createUsageLimiter({
  dailyLimit,
  perMinute,
}: {
  dailyLimit: number;
  perMinute: number;
}) {
  const daily = new Map<string, { day: string; count: number }>();
  const recent = new Map<string, number[]>();

  function remaining(accountId: string, now: Date) {
    const entry = daily.get(accountId);
    const used = entry && entry.day === dayKey(now) ? entry.count : 0;
    return Math.max(0, dailyLimit - used);
  }

  // Records the call when allowed; a rejected call is not counted.
  function take(
    accountId: string,
    now: Date,
  ):
    | { allowed: true; remaining: number }
    | { allowed: false; reason: "daily" | "burst" } {
    if (remaining(accountId, now) === 0)
      return { allowed: false, reason: "daily" };
    const windowStart = now.getTime() - 60_000;
    const calls = (recent.get(accountId) ?? []).filter((t) => t > windowStart);
    if (calls.length >= perMinute) {
      recent.set(accountId, calls);
      return { allowed: false, reason: "burst" };
    }
    recent.set(accountId, [...calls, now.getTime()]);
    const day = dayKey(now);
    const entry = daily.get(accountId);
    daily.set(accountId, {
      day,
      count: entry && entry.day === day ? entry.count + 1 : 1,
    });
    return { allowed: true, remaining: remaining(accountId, now) };
  }

  return { take, remaining };
}
