import { auth, authConfigured } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { AcademyApp } from "@/components/academy-app";
import { supportedScreens } from "@/lib/routes";
export const dynamic = "force-dynamic";
export default async function LearnerPage({
  params,
}: {
  params: Promise<{ segments?: string[] }>;
}) {
  if (!authConfigured()) redirect("/login?error=Configuration");
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { segments = [] } = await params;
  const screen = segments.join("/") || "dashboard";
  if (!supportedScreens.includes(screen)) notFound();
  return (
    <AcademyApp
      screen={screen}
      accountId={session.user.id}
      name={session.user.name ?? "Learner"}
      demo={false}
    />
  );
}
