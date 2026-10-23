"use client";
import { useLanguage } from "./language";
import Link from "next/link";
import { ArrowRight, BookOpen, Headphones, MessageCircle } from "lucide-react";
import { PageHeading } from "./common";
import { buttonVariants } from "./ui/button";

export function Tutor({ base }: { base: string }) {
  const { t } = useLanguage();
  return (
    <>
      <PageHeading
        eyebrow={t("A LITTLE HELP, WHEN YOU NEED IT")}
        title={t("Meet your future learning companion.")}
        description={t(
          "Patient explanations. Real-life conversations. English at your pace.",
        )}
      />
      <div className="tutor-intro card">
        <span className="tutor-orb">
          <MessageCircle size={39} strokeWidth={1.3} />
        </span>
        <span className="skill-pill">{t("COMING IN A FUTURE ITERATION")}</span>
        <h2>{t("A thoughtful tutor takes thoughtful preparation.")}</h2>
        <p className="muted">
          {t(
            "AI chat, writing feedback, and conversation practice are not connected yet. When available, responses will be generated securely on the server, with clear feedback and evidence limits.",
          )}
        </p>
        <div className="tutor-capabilities">
          <span>
            <BookOpen size={20} /> {t("Clear grammar help")}
          </span>
          <span>
            <MessageCircle size={20} /> {t("Everyday conversations")}
          </span>
          <span>
            <Headphones size={20} /> {t("Listening & speaking practice")}
          </span>
        </div>
        <Link className={buttonVariants()} href={`${base}/lessons`}>
          {t("Explore today's lessons")}
          <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}
