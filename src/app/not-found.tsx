import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main id="main" className="standalone-message">
      <span className="eyebrow">A LITTLE DETOUR</span>
      <h1>This page is waiting to be written.</h1>
      <p>Let&apos;s get you back to a familiar starting point.</p>
      <Link className={buttonVariants()} href="/">
        Back to EngThai
      </Link>
    </main>
  );
}
