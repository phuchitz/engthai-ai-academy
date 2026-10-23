import { authConfigured } from "@/auth";
import { LoginScreen } from "@/components/login-screen";
export const dynamic = "force-dynamic";
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return <LoginScreen configured={authConfigured()} error={error} />;
}
