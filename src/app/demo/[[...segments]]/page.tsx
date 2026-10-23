import { notFound } from "next/navigation";
import { AcademyApp } from "@/components/academy-app";
import { supportedScreens } from "@/lib/routes";
export default async function DemoPage({
  params,
}: {
  params: Promise<{ segments?: string[] }>;
}) {
  const { segments = [] } = await params;
  const screen = segments.join("/") || "dashboard";
  if (!supportedScreens.includes(screen)) notFound();
  return (
    <AcademyApp screen={screen} accountId="public-demo" name="Learner" demo />
  );
}
