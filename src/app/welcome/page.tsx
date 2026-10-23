import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Globe2,
  Leaf,
  Sparkles,
  Sprout,
  Target,
} from "lucide-react";
import { Brand, BookIllustration } from "@/components/common";
import { buttonVariants } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Link className="brand-link" href="/" aria-label="EngThai home">
          <Brand />
        </Link>
        <nav aria-label="Welcome navigation">
          <Link href="#your-journey">Your journey</Link>
          <Link href="/demo">Explore the demo</Link>
          <Link
            className={buttonVariants({ variant: "secondary" })}
            href="/login"
          >
            Sign in <ArrowRight size={16} />
          </Link>
        </nav>
      </header>
      <main id="main">
        <section className="landing-hero">
          <div className="landing-copy">
            <span className="eyebrow">
              <span className="mint-dot" /> ENGLISH FOR YOUR NEXT CHAPTER
            </span>
            <h1>
              A little practice.
              <br />A world of
              <br />
              <span>possibilities.</span>
            </h1>
            <p>
              Build the confidence to say what you mean.
              <br />A personal English learning journey, made for Thai speakers
              and the world ahead.
            </p>
            <p className="landing-thai" lang="th">
              เก่งภาษาอังกฤษขึ้น ทีละนิด ในแบบของคุณ
            </p>
            <div className="button-row">
              <Link className={buttonVariants()} href="/login">
                Start my journey <ArrowRight size={18} />
              </Link>
              <Link
                className={buttonVariants({ variant: "ghost" })}
                href="/demo"
              >
                Take a look around <ArrowRight size={16} />
              </Link>
            </div>
            <div className="landing-promises">
              <span>
                <Check size={14} /> Your pace
              </span>
              <span>
                <Check size={14} /> Thai explanations
              </span>
              <span>
                <Check size={14} /> Small daily steps
              </span>
            </div>
          </div>
          <div className="landing-visual">
            <span className="visual-kicker">
              <Sparkles size={15} /> HELLO, NEW POSSIBILITIES
            </span>
            <BookIllustration />
            <div className="floating-note note-confidence">
              <span className="mint-icon">
                <TrendingIcon />
              </span>
              <div>
                <strong>A more confident you.</strong>
                <small>One small step at a time.</small>
              </div>
            </div>
            <div className="floating-note note-practice">
              <Clock3 size={19} />
              <span>Just 15 minutes a day</span>
            </div>
            <div className="visual-bottom">
              <Leaf size={16} /> A LITTLE GROWTH, EVERY DAY
            </div>
          </div>
        </section>
        <section id="your-journey" className="landing-features">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A JOURNEY THAT FEELS LIKE YOU</span>
              <h2>Start where you are. Grow from there.</h2>
            </div>
            <span className="muted" lang="th">
              พร้อมไปด้วยกันทุกวัน
            </span>
          </div>
          <div className="feature-grid">
            {[
              {
                icon: Target,
                title: "Find your starting point",
                text: "A preliminary grammar, vocabulary, and reading check helps identify useful foundations.",
              },
              {
                icon: BookOpen,
                title: "Make a little progress",
                text: "Short lessons, clear examples, and Thai explanations turn small moments into useful practice.",
              },
              {
                icon: Sprout,
                title: "See your confidence grow",
                text: "Keep a learning streak, revisit new words, and celebrate the little wins along the way.",
              },
            ].map(({ icon: Icon, title, text }, index) => (
              <article key={title}>
                <span className={`feature-icon tone-${index}`}>
                  <Icon size={24} />
                </span>
                <small>0{index + 1}</small>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="landing-cta">
          <Globe2 size={27} />
          <h2>
            Your world is waiting.
            <br />
            <span>Let&apos;s find the words for it.</span>
          </h2>
          <Link className={buttonVariants()} href="/login">
            Begin with a small step <ArrowRight size={17} />
          </Link>
          <p>
            Progress stays in this browser during the early learning preview.
          </p>
        </section>
      </main>
      <footer className="landing-footer">
        <Brand />
        <p>
          English for your world. <span lang="th">ภาษาอังกฤษในแบบของคุณ</span>
        </p>
        <Link href="/demo/settings">Privacy & local progress</Link>
      </footer>
    </div>
  );
}
function TrendingIcon() {
  return <Sprout size={23} />;
}
