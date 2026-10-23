import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sprout } from "lucide-react";
import { authConfigured } from "@/auth";
import { googleSignIn } from "@/app/actions";
import { Brand } from "@/components/common";
import { SignInButton } from "@/components/sign-in-button";
import { buttonVariants } from "@/components/ui/button";
export const dynamic = "force-dynamic";
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const configured = authConfigured();
  const { error } = await searchParams;
  return (
    <div className="login-page">
      <header>
        <Link href="/" className="brand-link" aria-label="EngThai home">
          <Brand />
        </Link>
        <Link href="/" className="text-link">
          <ArrowLeft size={15} /> Back home
        </Link>
      </header>
      <main id="main" className="login-card card">
        <span className="success-medallion">
          <Sprout size={33} />
        </span>
        <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
        <h1>
          A little hello.
          <br />A fresh beginning.
        </h1>
        <p className="muted">
          Sign in to your personal English learning space.
        </p>
        <p className="thai-welcome" lang="th">
          ยินดีต้อนรับสู่การเรียนรู้ในแบบของคุณ
        </p>
        {!configured ? (
          <div role="status" className="info-box">
            <div>
              <strong>Google sign-in needs configuration</strong>
              <p>
                The app owner needs to configure Google OAuth and an
                authentication secret. You can explore the public demo while
                setup is completed.
              </p>
            </div>
          </div>
        ) : error ? (
          <div role="alert" className="alert error">
            Google sign-in could not be completed. Please try again with a
            verified Google account. If it continues, contact the app owner.
          </div>
        ) : null}
        <form action={googleSignIn}>
          <SignInButton configured={configured} />
        </form>
        <div className="login-divider">
          <span />
          or explore first
          <span />
        </div>
        <Link
          className={buttonVariants({
            variant: "secondary",
            className: "demo-signin",
          })}
          href="/demo"
        >
          Explore the public demo
        </Link>
        <p className="privacy-note">
          <ShieldCheck size={14} /> Authentication uses Google. Learning
          progress is browser-local and does not sync across devices.
        </p>
      </main>
      <footer>A little practice. A world of possibilities.</footer>
    </div>
  );
}
