"use client";
import Link from "next/link";
import {
  ArrowRight,
  AudioLines,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Flame,
  GraduationCap,
  Play,
  RotateCcw,
  Target,
  Zap,
} from "lucide-react";
import type { LearnerState, Lesson } from "@/lib/models";
import { dailyProgress, dayKey, lessons, streakDays } from "@/lib/learning";
import { scoreAssessment } from "@/lib/assessment";

export function Stats({ state }: { state: LearnerState }) {
  const totalXp = state.attempts.reduce((sum, a) => sum + a.xp, 0);
  const data = [
    {
      icon: Flame,
      value: streakDays(state.attempts, new Date()),
      label: "day learning streak",
      tone: "peach",
    },
    { icon: Zap, value: totalXp, label: "total learning XP", tone: "lavender" },
    {
      icon: CheckCircle2,
      value: state.attempts.length,
      label: "lessons completed",
      tone: "mint",
    },
  ];
  return (
    <div className="stats-grid">
      {data.map(({ icon: Icon, value, label, tone }) => (
        <div className="stat-card card" key={label}>
          <span className={`stat-icon ${tone}`}>
            <Icon size={21} />
          </span>
          <div>
            <strong>{value.toLocaleString()}</strong>
            <span>{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LevelCard({
  result,
  href,
  assessmentStarted,
}: {
  result: ReturnType<typeof scoreAssessment> | null;
  href: string;
  assessmentStarted: boolean;
}) {
  return (
    <section className="level-card card">
      <div className="card-eyebrow">
        YOUR STARTING POINT <span className="tiny-badge">PRELIMINARY</span>
      </div>
      <div className="level-center">
        <div className="level-ring">
          <div>
            <strong>{result?.estimatedLevel ?? "?"}</strong>
            <span>
              {result?.estimatedLevel ? "estimated" : "LET'S FIND OUT"}
            </span>
          </div>
        </div>
        <h3>
          {result?.estimatedLevel
            ? "A foundation to grow from"
            : "Your potential is waiting."}
        </h3>
        <p className="muted">
          {result
            ? `${result.coverage} of 6 skills checked. Recognition evidence only.`
            : "A short skills check helps us find the right place to begin."}
        </p>
      </div>
      <Link href={href} className="level-link">
        {result
          ? "Understand my results"
          : assessmentStarted
            ? "Continue my skills check"
            : "Find my starting point"}
        <ArrowRight size={16} />
      </Link>
    </section>
  );
}

export function DailyGoal({ state }: { state: LearnerState }) {
  const today = dailyProgress(state.attempts).find(
    (d) => d.date === dayKey(new Date()),
  );
  const minutes = state.attempts
    .filter((a) => dayKey(new Date(a.completedAt)) === dayKey(new Date()))
    .reduce(
      (sum, a) =>
        sum + (lessons.find((l) => l.id === a.lessonId)?.minutes ?? 0),
      0,
    );
  const goal = state.preferences?.dailyMinutes ?? 15;
  return (
    <section className="daily-goal card">
      <div className="card-eyebrow">
        TODAY&apos;S LITTLE GOAL <Target size={17} />
      </div>
      <div className="goal-value">
        <strong>
          {minutes}
          <small> / {goal} min</small>
        </strong>
        <span>{today?.xp ?? 0} XP</span>
      </div>
      <progress
        aria-label="Estimated lesson minutes toward daily goal"
        value={Math.min(minutes, goal)}
        max={goal}
      />
      <p>
        {minutes >= goal
          ? "You made time for yourself. Well done!"
          : "Make a little space for your future self."}
      </p>
      <small className="muted">
        Minutes use lesson estimates, not a timer.
      </small>
    </section>
  );
}

export function LessonCard({
  lesson,
  href,
  complete,
  index,
}: {
  lesson: Lesson;
  href: string;
  complete: boolean;
  index: number;
}) {
  const Icon =
    lesson.skill === "grammar"
      ? AudioLines
      : lesson.skill === "reading"
        ? BookOpen
        : GraduationCap;
  return (
    <Link href={href} className="lesson-card card">
      <span className={`lesson-art ${lesson.skill}`}>
        <Icon size={27} strokeWidth={1.5} />
        <span className="art-dot" />
      </span>
      <div className="lesson-info">
        <div className="lesson-meta">
          <span>{lesson.skill}</span>
          <span className="meta-dot">·</span>
          {lesson.level}
          <span className="meta-dot">·</span>
          <Clock3 size={11} /> {lesson.minutes} min
        </div>
        <h3>{lesson.title}</h3>
        <p>{lesson.description}</p>
      </div>
      <div className="lesson-end">
        <span className={complete ? "complete-badge" : "xp-badge"}>
          {complete ? (
            <>
              <Check size={12} /> Completed
            </>
          ) : (
            `+${lesson.xp} XP`
          )}
        </span>
        <span className={`lesson-play ${index === 0 ? "primary" : ""}`}>
          {complete ? (
            <RotateCcw size={16} />
          ) : (
            <Play size={15} fill="currentColor" />
          )}
        </span>
      </div>
    </Link>
  );
}
