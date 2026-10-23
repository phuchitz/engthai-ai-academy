"use client";
import Link from "next/link";
import { ShieldCheck, Sprout } from "lucide-react";
import { googleSignIn } from "@/app/actions";
import { Brand } from "./common";
import { SignInButton } from "./sign-in-button";
import { buttonVariants } from "./ui/button";
import { LanguageSwitcher, useLanguage } from "./language";
export function LoginScreen({
  configured,
  error,
}: {
  configured: boolean;
  error?: string;
}) {
  const { t } = useLanguage();
  return (
    <div className="login-page">
      <header>
        <Link href="/" className="brand-link" aria-label={t("EngThai home")}>
          <Brand />
        </Link>
        <LanguageSwitcher />
      </header>
      <main id="main" className="login-card card">
        <span className="success-medallion">
          <Sprout size={33} />
        </span>
        <span className="eyebrow">{t("YOUR NEXT CHAPTER STARTS HERE")}</span>
        <h1>
          {t("A little hello.")}
          <br />
          {t("A fresh beginning.")}
        </h1>
        <p className="muted">
          {t("Sign in to your personal English learning space.")}
        </p>
        {!configured ? (
          <div role="status" className="info-box">
            <div>
              <strong>{t("Google sign-in needs configuration")}</strong>
              <p>
                {t(
                  "The app owner needs to configure Google OAuth and an authentication secret. You can explore the public demo while setup is completed.",
                )}
              </p>
            </div>
          </div>
        ) : error ? (
          <div role="alert" className="alert error">
            {t(
              "Google sign-in could not be completed. Please try again with a verified Google account. If it continues, contact the app owner.",
            )}
          </div>
        ) : null}
        <form action={googleSignIn}>
          <SignInButton configured={configured} />
        </form>
        <div className="login-divider">
          <span />
          {t("or explore first")}
          <span />
        </div>
        <Link
          className={buttonVariants({
            variant: "secondary",
            className: "demo-signin",
          })}
          href="/demo"
        >
          {t("Explore the public demo")}
        </Link>
        <p className="privacy-note">
          <ShieldCheck size={14} />
          {t(
            "Authentication uses Google. Learning progress is browser-local and does not sync across devices.",
          )}
        </p>
      </main>
      <footer>
        <p>{t("A little practice. A world of possibilities.")}</p>
        <Link className="text-link" href="/welcome">
          {t("About EngThai")}
        </Link>
      </footer>
    </div>
  );
}
