"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Trophy } from "lucide-react";
import { dailyProgress, dayKey, lessons, streakDays } from "@/lib/learning";
import type { LearnerState } from "@/lib/models";
import { PageHeading } from "./common";
import { Stats } from "./dashboard";

export function Progress({
  state,
  base,
}: {
  state: LearnerState;
  base: string;
}) {
  const [now] = useState(() => Date.now());
  const days = dailyProgress(state.attempts);
  const weekly = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now - (6 - i) * 86400000);
    return { date, xp: days.find((d) => d.date === dayKey(date))?.xp ?? 0 };
  });
  const max = Math.max(50, ...weekly.map((d) => d.xp));
  return (
    <>
      <PageHeading
        eyebrow="EVERY SMALL STEP COUNTS"
        title="Look how you're growing."
        description="Learning activity tells your story. Proficiency requires separate assessment evidence."
      />
      <Stats state={state} />
      <div className="result-columns">
        <section className="card activity-card">
          <h2>Your week in little wins</h2>
          <p className="muted">Learning XP · Bangkok calendar days</p>
          <div
            className="activity-chart"
            role="img"
            aria-label={weekly
              .map(
                (d) =>
                  `${d.date.toLocaleDateString("en-GB", { timeZone: "Asia/Bangkok", weekday: "long" })}: ${d.xp} XP`,
              )
              .join(", ")}
          >
            {weekly.map((d) => (
              <div className="activity-day" key={dayKey(d.date)}>
                <span>{d.xp}</span>
                <div className="bar-track">
                  <span
                    style={{ height: `${Math.max(3, (d.xp / max) * 100)}%` }}
                  />
                </div>
                <small>
                  {d.date.toLocaleDateString("en-GB", {
                    timeZone: "Asia/Bangkok",
                    weekday: "short",
                  })}
                </small>
              </div>
            ))}
          </div>
          {state.attempts.length === 0 && (
            <p className="privacy-note">
              Your first completed lesson will bring this chart to life.
            </p>
          )}
        </section>
        <section className="card achievements">
          <h2>Little milestones</h2>
          {[
            {
              title: "A fresh beginning",
              description: "Complete your first lesson",
              unlocked: state.attempts.length >= 1,
            },
            {
              title: "A growing habit",
              description: "Learn on three consecutive days",
              unlocked: streakDays(state.attempts, new Date()) >= 3,
            },
            {
              title: "Room to grow",
              description: "Complete all six foundation lessons",
              unlocked:
                new Set(state.attempts.map((a) => a.lessonId)).size >=
                lessons.length,
            },
          ].map((a) => (
            <div
              className={`achievement ${a.unlocked ? "unlocked" : ""}`}
              key={a.title}
            >
              <span>
                <Trophy size={23} />
              </span>
              <div>
                <strong>{a.title}</strong>
                <p>{a.description}</p>
                <small>{a.unlocked ? "Achieved" : "Still growing"}</small>
              </div>
            </div>
          ))}
        </section>
      </div>
      <div className="section-heading">
        <h2>Your recent learning</h2>
        <Link href={`${base}/lessons`} className="text-link">
          Continue learning <ArrowRight size={15} />
        </Link>
      </div>
      <section className="card history">
        {state.attempts.length ? (
          [...state.attempts]
            .reverse()
            .slice(0, 10)
            .map((a) => (
              <div key={a.lessonId}>
                <CheckCircle2 size={18} />
                <strong>
                  {lessons.find((l) => l.id === a.lessonId)?.title ??
                    a.lessonId}
                </strong>
                <span>
                  {new Date(a.completedAt).toLocaleDateString("en-GB", {
                    timeZone: "Asia/Bangkok",
                  })}
                </span>
                <b>+{a.xp} XP</b>
              </div>
            ))
        ) : (
          <p className="muted">
            A blank page is a lovely place to start. Complete a lesson to record
            your first step.
          </p>
        )}
      </section>
    </>
  );
}
