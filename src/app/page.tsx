import { redirect } from "next/navigation";
import { auth, authConfigured } from "@/auth";
export const dynamic = "force-dynamic";
export default async function HomePage() {
  const session = authConfigured() ? await auth() : null;
  redirect(session?.user?.id ? "/learn" : "/login");
}
