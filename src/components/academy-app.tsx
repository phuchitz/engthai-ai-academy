"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  AudioLines,
  BookOpen,
  ChevronRight,
  Clock3,
  GraduationCap,
  House,
  Leaf,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
  TrendingUp,
  X,
} from "lucide-react";
import { googleSignOut } from "@/app/actions";
import { scoreAssessment } from "@/lib/assessment";
import { buildLearningPath, completeLesson, lessons } from "@/lib/learning";
import {
  emptyLearnerState,
  type LearnerState,
  type UserPreferences,
} from "@/lib/models";
import { browserRepository } from "@/lib/storage";
import { buttonVariants } from "./ui/button";
import { Onboarding } from "./onboarding";
import { Brand, BookIllustration, PageHeading } from "./common";
import { Stats, LevelCard, DailyGoal, LessonCard } from "./dashboard";
import { Assessment, Results } from "./assessment-screens";
import { LessonPlayer, Vocabulary } from "./practice";
import { Progress } from "./progress";
import { Settings } from "./settings";
import { Tutor } from "./tutor";

const navigation = [
  { screen: "dashboard", label: "My learning", icon: House },
  { screen: "lessons", label: "Daily lessons", icon: BookOpen },
  { screen: "vocabulary", label: "Vocabulary", icon: GraduationCap },
  { screen: "grammar", label: "Grammar studio", icon: AudioLines },
  { screen: "tutor", label: "AI tutor", icon: MessageCircle },
  { screen: "progress", label: "My progress", icon: TrendingUp },
];

type Props = { screen: string; accountId: string; name: string; demo: boolean };
export function AcademyApp({ screen, accountId, name, demo }: Props) {
  const router = useRouter();
  const base = demo ? "/demo" : "/learn";
  const [state, setState] = useState<LearnerState | null>(null);
  const [issue, setIssue] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const [notice, setNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      try {
        setState(browserRepository(localStorage, accountId).load());
      } catch {
        setIssue(
          "We couldn't read your saved progress. Browser storage may be blocked or damaged. You can reset it in Settings.",
        );
        setLoadFailed(true);
        setState(emptyLearnerState());
      }
      try {
        setDark(localStorage.getItem("engthai:theme") === "dark");
      } catch {
        /* Theme storage is optional. */
      }
    });
    function sync(event: StorageEvent) {
      if (event.key !== `engthai:v1:${accountId}`) return;
      try {
        setState(browserRepository(localStorage, accountId).load());
        setIssue("");
        setLoadFailed(false);
      } catch {
        setIssue(
          "Progress changed in another tab but could not be loaded. Reload or open Settings.",
        );
        setLoadFailed(true);
      }
    }
    window.addEventListener("storage", sync);
    return () => {
      active = false;
      window.removeEventListener("storage", sync);
    };
  }, [accountId]);

  function update(next: LearnerState) {
    if (loadFailed) {
      setIssue(
        "Saved progress could not be read. Reset browser progress in Settings before making changes.",
      );
      return false;
    }
    try {
      browserRepository(localStorage, accountId).save(next);
      setIssue("");
      setState(next);
      return true;
    } catch {
      setIssue(
        "Your changes could not be saved. Allow browser storage or free some space, then try again.",
      );
      return false;
    }
  }
  function theme() {
    setDark(!dark);
    try {
      localStorage.setItem("engthai:theme", dark ? "light" : "dark");
    } catch {
      /* The chosen theme still works for this session. */
    }
  }
  const href = (destination: string) => `${base}/${destination}`;
  const result = state?.assessment?.completedAt
    ? scoreAssessment(state.assessment.answers)
    : null;
  const displayName =
    state?.preferences?.displayName || (demo ? "friend" : name.split(" ")[0]);
  const currentTitle = screen.startsWith("lesson/")
    ? "Daily lessons"
    : (navigation.find((item) => item.screen === screen)?.label ??
      ({
        assessment: "Placement check",
        results: "Your results",
        onboarding: "Welcome aboard",
        settings: "Settings",
      }[screen] ||
        "My learning"));
  const greeting = (
    <>
      <span className="eyebrow">
        A LITTLE PRACTICE. A WORLD OF POSSIBILITIES.
      </span>
      <h1>
        Your next chapter starts here<span className="lavender-text">.</span>
      </h1>
    </>
  );
  const savePreferences = (preferences: UserPreferences) => {
    if (state && update({ ...state, preferences })) {
      setNotice("Your preferences are saved in this browser.");
      router.push(href(screen === "settings" ? "settings" : "assessment"));
    }
  };
  const navigate = (destination: string) => {
    setMenuOpen(false);
    router.push(href(destination));
  };

  return (
    <div className={`academy ${dark ? "dark" : ""}`}>
      {menuOpen && (
        <button
          className="nav-scrim"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside
        className={`sidebar ${menuOpen ? "open" : ""}`}
        aria-label="Main navigation"
      >
        <Link className="brand-link" href="/" aria-label="EngThai home">
          <Brand />
        </Link>
        <button
          className="mobile-close icon-button"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        >
          <X size={20} />
        </button>
        <div className="workspace-label">YOUR LEARNING SPACE</div>
        <nav>
          {navigation.map(({ screen: destination, label, icon: Icon }) => (
            <Link
              key={destination}
              href={href(destination)}
              onClick={() => setMenuOpen(false)}
              aria-current={
                screen === destination ||
                (destination === "lessons" && screen.startsWith("lesson/"))
                  ? "page"
                  : undefined
              }
              className="nav-item"
            >
              <Icon size={19} strokeWidth={1.7} />
              <span>{label}</span>
              {destination === "tutor" && <span className="nav-tag">SOON</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-grow" />
        <div className="sidebar-note">
          <span className="note-icon">
            <Sprout size={26} />
          </span>
          <strong>Small steps, real growth.</strong>
          <p>You&apos;re closer than you were yesterday.</p>
          <span lang="th">เก่งขึ้นได้ทุกวัน</span>
        </div>
        <Link
          href={href("settings")}
          onClick={() => setMenuOpen(false)}
          className="nav-item"
          aria-current={screen === "settings" ? "page" : undefined}
        >
          <Settings2 size={19} /> Settings & profile
        </Link>
        {demo ? (
          <Link href="/login" className="nav-item">
            <LogOut size={18} /> Sign in with Google
          </Link>
        ) : (
          <form action={googleSignOut}>
            <button className="nav-item">
              <LogOut size={18} /> Sign out
            </button>
          </form>
        )}
        <div className="sidebar-profile">
          <span className="avatar">{displayName.charAt(0).toUpperCase()}</span>
          <span>
            <strong>{displayName}</strong>
            <small>
              {demo
                ? "Exploring the public demo"
                : "Your personal learning journey"}
            </small>
          </span>
          <span className="online-dot" />
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
            <span>My academy</span>
            <ChevronRight size={14} />
            <strong>{currentTitle}</strong>
          </div>
          <div className="topbar-actions">
            <span className="local-pill">
              <ShieldCheck size={14} />{" "}
              {demo ? "Public demo" : "Private learning space"}
            </span>
            <button
              className="icon-button"
              aria-label={
                dark ? "Switch to light theme" : "Switch to dark theme"
              }
              onClick={theme}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              href={href("settings")}
              className="avatar small"
              aria-label="Open your profile"
            >
              {displayName.charAt(0).toUpperCase()}
            </Link>
          </div>
        </header>
        <main id="main" className="main-content">
          {demo && (
            <div className="demo-banner">
              <span>
                <Sparkles size={14} /> You&apos;re exploring the demo. Progress
                stays in this browser, separate from signed-in accounts.
              </span>
              <Link href="/login">
                Make it yours <ArrowRight size={13} />
              </Link>
            </div>
          )}
          {issue && (
            <div role="alert" className="alert error">
              {issue} <Link href={href("settings")}>Open Settings</Link>
            </div>
          )}
          {notice && (
            <div role="status" className="alert success">
              {notice}
              <button
                aria-label="Dismiss notification"
                onClick={() => setNotice("")}
              >
                <X size={16} />
              </button>
            </div>
          )}
          {!state ? (
            <div className="loading-state" role="status">
              <span className="loading-dot" />
              <p>Opening your learning space…</p>
            </div>
          ) : (
            <>
              {screen === "onboarding" ||
              (!demo && !state.preferences && screen !== "settings") ? (
                <Onboarding
                  initial={state.preferences}
                  onSave={savePreferences}
                />
              ) : (
                <>
                  {screen === "dashboard" && (
                    <>
                      <div className="page-heading">
                        <div>
                          <div className="greeting">
                            Hello, {displayName}{" "}
                            <span aria-hidden="true">☀</span>
                          </div>
                          {greeting}
                          <p className="muted">
                            A little English today. A more confident you
                            tomorrow. <span lang="th">มาเรียนรู้ไปด้วยกัน</span>
                          </p>
                        </div>
                        <div className="today-chip">
                          <span className="mint-dot" /> YOUR PACE. YOUR
                          PROGRESS.
                        </div>
                      </div>
                      <div className="dashboard-grid">
                        <div className="dashboard-primary">
                          <section className="learning-hero">
                            <div className="hero-copy">
                              <span className="hero-label">
                                <Sparkles size={14} /> MADE FOR YOUR JOURNEY
                              </span>
                              <h2>
                                {state.preferences
                                  ? "Keep your curiosity.\nGrow your confidence."
                                  : "English for your world.\nStart with a small step."}
                              </h2>
                              <p>
                                {result
                                  ? buildLearningPath(result, state).reason
                                  : "Discover your starting point and build a learning path that feels like you."}
                              </p>
                              <Link
                                className={buttonVariants()}
                                href={href(
                                  !state.preferences
                                    ? "onboarding"
                                    : !result
                                      ? "assessment"
                                      : `lesson/${buildLearningPath(result, state).lessonIds[0]}`,
                                )}
                              >
                                {!state.preferences
                                  ? "Start my journey"
                                  : "Continue Learning"}
                                <ArrowRight size={17} />
                              </Link>
                              <div className="hero-footnote">
                                <Clock3 size={13} /> Just{" "}
                                {state.preferences?.dailyMinutes ?? 15} minutes
                                for a little growth
                              </div>
                            </div>
                            <BookIllustration />
                          </section>
                          <Stats state={state} />
                          <section className="section-block">
                            <div className="section-heading">
                              <div>
                                <h2>Your daily learning path</h2>
                                <p className="muted">
                                  A thoughtful mix of practice, picked for you.
                                </p>
                              </div>
                              <Link
                                href={href("lessons")}
                                className="text-link"
                              >
                                View all <ArrowRight size={15} />
                              </Link>
                            </div>
                            <div className="lesson-list">
                              {buildLearningPath(result, state)
                                .lessonIds.slice(0, 3)
                                .map((id, index) => (
                                  <LessonCard
                                    key={id}
                                    lesson={lessons.find((l) => l.id === id)!}
                                    href={href(`lesson/${id}`)}
                                    complete={state.attempts.some(
                                      (a) => a.lessonId === id,
                                    )}
                                    index={index}
                                  />
                                ))}
                            </div>
                          </section>
                          <div className="gentle-banner">
                            <span className="mint-icon">
                              <Leaf size={20} />
                            </span>
                            <div>
                              <strong>
                                Consistency feels better than perfection.
                              </strong>
                              <p>
                                One lesson is one step forward. You&apos;ve got
                                this.
                              </p>
                            </div>
                            <span aria-hidden="true">✦</span>
                          </div>
                        </div>
                        <div className="dashboard-secondary">
                          <LevelCard
                            result={result}
                            assessmentStarted={!!state.assessment}
                            href={href(result ? "results" : "assessment")}
                          />
                          <DailyGoal state={state} />
                          <section className="word-preview card">
                            <div className="card-eyebrow">
                              A WORD TO TAKE WITH YOU <Sprout size={16} />
                            </div>
                            <h3>
                              confident <span>adjective</span>
                            </h3>
                            <p lang="th">มั่นใจ</p>
                            <blockquote>
                              “I feel more confident
                              <br />
                              every day.”
                            </blockquote>
                            <Link
                              className="text-link"
                              href={href("vocabulary")}
                            >
                              Explore vocabulary <ArrowRight size={15} />
                            </Link>
                          </section>
                        </div>
                      </div>
                    </>
                  )}
                  {screen === "assessment" && (
                    <Assessment
                      state={state}
                      update={update}
                      onFinish={() => navigate("results")}
                    />
                  )}
                  {screen === "results" && (
                    <Results state={state} base={base} />
                  )}
                  {(screen === "lessons" || screen === "grammar") && (
                    <>
                      <PageHeading
                        eyebrow={
                          screen === "grammar"
                            ? "GRAMMAR STUDIO"
                            : "A LITTLE BETTER, EVERY DAY"
                        }
                        title={
                          screen === "grammar"
                            ? "Make the pieces click."
                            : "Your next small step."
                        }
                        description={
                          screen === "grammar"
                            ? "Clear explanations. Thai support. Useful practice."
                            : buildLearningPath(result, state).reason
                        }
                      />
                      <div className="lesson-catalog">
                        {(screen === "grammar"
                          ? lessons.filter((l) => l.skill === "grammar")
                          : buildLearningPath(result, state).lessonIds.map(
                              (id) => lessons.find((l) => l.id === id)!,
                            )
                        ).map((lesson, index) => (
                          <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                            href={href(`lesson/${lesson.id}`)}
                            complete={state.attempts.some(
                              (a) => a.lessonId === lesson.id,
                            )}
                            index={index}
                          />
                        ))}
                      </div>
                      <p className="privacy-note">
                        Foundation practice · These short exercises support
                        learning, rather than certify mastery of a CEFR level.
                      </p>
                    </>
                  )}
                  {screen.startsWith("lesson/") && (
                    <LessonPlayer
                      key={screen}
                      lesson={lessons.find(
                        (l) => l.id === screen.split("/")[1],
                      )!}
                      completed={state.attempts.some(
                        (a) => a.lessonId === screen.split("/")[1],
                      )}
                      onComplete={(lesson) => {
                        if (
                          update({
                            ...state,
                            attempts: completeLesson(
                              state.attempts,
                              lesson,
                              new Date(),
                            ),
                          })
                        ) {
                          setNotice(
                            "Lesson completed. A small step worth celebrating!",
                          );
                          navigate("dashboard");
                        }
                      }}
                      backHref={href("lessons")}
                    />
                  )}
                  {screen === "vocabulary" && (
                    <Vocabulary state={state} update={update} />
                  )}
                  {screen === "progress" && (
                    <Progress state={state} base={base} />
                  )}
                  {screen === "tutor" && <Tutor base={base} />}
                  {screen === "settings" && (
                    <>
                      <PageHeading
                        eyebrow="MAKE YOURSELF AT HOME"
                        title="Your learning, your way."
                        description="Your preferences, your privacy, and a little room to grow."
                      />
                      <Settings
                        state={state}
                        onSave={savePreferences}
                        onReset={() => {
                          try {
                            browserRepository(localStorage, accountId).clear();
                            setState(emptyLearnerState());
                            setLoadFailed(false);
                            setIssue("");
                            setNotice(
                              "Browser progress has been reset for this account.",
                            );
                          } catch {
                            setIssue(
                              "Browser storage is blocked. Please enable storage and try again.",
                            );
                          }
                        }}
                        demo={demo}
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}
          <footer className="workspace-footer">
            <span>
              Made for your next chapter.{" "}
              <span lang="th">เรียนรู้ทีละนิด เติบโตทุกวัน</span>
            </span>
            <span>
              <Leaf size={12} /> Learning at your own pace
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
