import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpen, Leaf, Sparkles } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";

export function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark">
        <BookOpen size={23} strokeWidth={1.8} />
      </span>
      <span>
        Eng<span className="brand-accent">Thai</span>
        <small>AI ACADEMY</small>
      </span>
    </span>
  );
}

export function BookIllustration() {
  return (
    <div className="book-illustration" aria-hidden="true">
      <span className="orbit orbit-one" />
      <span className="orbit orbit-two" />
      <span className="floating-star star-one">✦</span>
      <span className="floating-star star-two">✧</span>
      <span className="floating-leaf">
        <Leaf size={36} />
      </span>
      <div className="book book-bottom">
        <span>one step at a time</span>
      </div>
      <div className="book book-middle" />
      <div className="book book-top">
        <BookOpen size={45} strokeWidth={1.2} />
      </div>
      <span className="mini-bubble">
        Hello! <span lang="th">สวัสดี</span>
      </span>
      <span className="illustration-spark">
        <Sparkles size={20} />
      </span>
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  href,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <div className="assessment-intro card">
      <span className="success-medallion">{icon}</span>
      <h1>{title}</h1>
      <p className="muted">{description}</p>
      <Link className={buttonVariants()} href={href}>
        {action} <ArrowRight size={16} />
      </Link>
    </div>
  );
}
