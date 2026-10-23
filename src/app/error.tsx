"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="standalone-message">
      <h1>A little interruption.</h1>
      <p>
        We couldn&apos;t open this part of your learning space. Please try
        again.
      </p>
      <div className="button-row">
        <Button onClick={reset}>Try again</Button>
        <Link href="/">Back home</Link>
      </div>
    </main>
  );
}
