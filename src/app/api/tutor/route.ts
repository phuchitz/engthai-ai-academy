import { auth, authConfigured } from "@/auth";
import {
  tutorRequestSchema,
  type TutorErrorCode,
  type TutorStatus,
} from "@/lib/ai";
import { aiConfigured, runTutor, TutorError } from "@/lib/ai-server";
import { createUsageLimiter } from "@/lib/usage-limit";

// Allows for one model call (40 s client timeout) with a retry margin on Vercel.
export const maxDuration = 60;

const DAILY_LIMIT = 30;
const limiter = createUsageLimiter({ dailyLimit: DAILY_LIMIT, perMinute: 6 });
const noStore = { "Cache-Control": "private, no-store" };

const statusFor: Record<TutorErrorCode, number> = {
  "not-configured": 503,
  unauthenticated: 401,
  "invalid-request": 400,
  "rate-limited": 429,
  busy: 503,
  timeout: 504,
  declined: 422,
  unavailable: 502,
};

function fail(code: TutorErrorCode, message: string) {
  return Response.json(
    { error: code, message },
    { status: statusFor[code], headers: noStore },
  );
}

async function accountId() {
  if (!authConfigured()) return null;
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function GET() {
  const id = await accountId();
  if (!id) return fail("unauthenticated", "Sign in to use the AI tutor.");
  const status: TutorStatus = {
    configured: aiConfigured(),
    remaining: limiter.remaining(id, new Date()),
    dailyLimit: DAILY_LIMIT,
  };
  return Response.json(status, { headers: noStore });
}

export async function POST(request: Request) {
  // Reject cross-site posts even though the session cookie is SameSite=Lax.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return fail("invalid-request", "Cross-site requests are not allowed.");
  const id = await accountId();
  if (!id) return fail("unauthenticated", "Sign in to use the AI tutor.");
  if (!aiConfigured())
    return fail("not-configured", "The AI tutor is not configured yet.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("invalid-request", "The request body must be JSON.");
  }
  const parsed = tutorRequestSchema.safeParse(body);
  if (!parsed.success)
    return fail("invalid-request", "Please check your message and try again.");

  const usage = limiter.take(id, new Date());
  if (!usage.allowed)
    return fail(
      "rate-limited",
      usage.reason === "daily"
        ? "You've reached today's AI tutor limit. Please come back tomorrow."
        : "Please wait a moment before sending another message.",
    );

  try {
    const response = await runTutor(parsed.data);
    return Response.json(
      { ...response, remaining: usage.remaining },
      { headers: noStore },
    );
  } catch (error) {
    if (error instanceof TutorError) return fail(error.code, error.message);
    console.error(
      "tutor failure",
      error instanceof Error ? error.name : "unknown",
    );
    return fail("unavailable", "The tutor is unavailable right now.");
  }
}
