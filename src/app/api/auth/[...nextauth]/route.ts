import { handlers, authConfigured } from "@/auth";
import type { NextRequest } from "next/server";
function unavailable() {
  return Response.json(
    { error: "Google sign-in is not configured." },
    { status: 503, headers: { "Cache-Control": "private, no-store" } },
  );
}
export async function GET(request: NextRequest) {
  return authConfigured() ? handlers.GET(request) : unavailable();
}
export async function POST(request: NextRequest) {
  return authConfigured() ? handlers.POST(request) : unavailable();
}
