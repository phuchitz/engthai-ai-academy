import { describe, expect, it } from "vitest";
import {
  buildLearningPath,
  completeLesson,
  dailyProgress,
  dayKey,
  lessons,
  scheduleReview,
  streakDays,
} from "@/lib/learning";
import { emptyLearnerState } from "@/lib/models";
import { scoreAssessment } from "@/lib/assessment";
import { questions } from "@/lib/questions";
const date = new Date("2026-10-24T06:00:00Z");
describe("learning progress", () => {
  it("uses a travel goal without moving it ahead of an observed foundational gap", () => {
    const state = emptyLearnerState();
    state.preferences = {
      displayName: "Nok",
      goals: ["Travel"],
      dailyMinutes: 15,
      topics: ["Travel & culture"],
      motivation: "",
    };
    expect(buildLearningPath(null, state).lessonIds[0]).toBe("travel-words");
    expect(buildLearningPath(null, state).reason).toContain("travel goal");
    const answers = questions
      .filter((q) => ["A1", "A2"].includes(q.level))
      .map((q) => ({
        questionId: q.id,
        option:
          q.skill === "grammar" && q.level === "A2"
            ? (q.correct + 1) % 4
            : q.correct,
      }));
    expect(
      buildLearningPath(scoreAssessment(answers), state).lessonIds[0],
    ).toBe("sentence-foundations");
  });
  it("awards completion XP only once and leaves assessment scores separate", () => {
    const once = completeLesson([], lessons[0], date);
    expect(once[0].xp).toBe(30);
    expect(completeLesson(once, lessons[0], date)).toBe(once);
    expect(scoreAssessment([]).estimatedLevel).toBeNull();
  });
  it("uses Bangkok midnight boundaries for XP and streaks", () => {
    expect(dayKey(new Date("2026-10-23T17:00:00Z"))).toBe("2026-10-24");
    const attempts = [
      {
        lessonId: "a",
        completedAt: "2026-10-22T18:00:00Z",
        correct: true,
        xp: 30,
      },
      {
        lessonId: "b",
        completedAt: "2026-10-23T16:59:59Z",
        correct: true,
        xp: 40,
      },
      {
        lessonId: "c",
        completedAt: "2026-10-23T17:00:00Z",
        correct: true,
        xp: 35,
      },
    ];
    expect(dailyProgress(attempts)).toEqual([
      { date: "2026-10-23", xp: 70, lessons: 2 },
      { date: "2026-10-24", xp: 35, lessons: 1 },
    ]);
    expect(streakDays(attempts, date)).toBe(2);
    expect(streakDays(attempts, new Date("2026-10-25T06:00:00Z"))).toBe(2);
    expect(streakDays(attempts, new Date("2026-10-26T06:00:00Z"))).toBe(0);
    expect(streakDays([], date)).toBe(0);
  });
  it("prioritizes foundational practice in the weakest skill and excludes completed lessons", () => {
    const answers = questions
      .filter((q) => ["A1", "A2"].includes(q.level))
      .map((q) => ({
        questionId: q.id,
        option:
          q.skill === "reading" && q.level === "A2"
            ? (q.correct + 1) % 4
            : q.correct,
      }));
    const result = scoreAssessment(answers);
    const state = emptyLearnerState();
    expect(buildLearningPath(result, state).lessonIds[0]).toBe(
      "reading-details",
    );
    state.attempts = completeLesson(
      [],
      lessons.find((l) => l.id === "reading-details")!,
      date,
    );
    expect(buildLearningPath(result, state).lessonIds).not.toContain(
      "reading-details",
    );
    expect(buildLearningPath(null, emptyLearnerState()).lessonIds).toHaveLength(
      6,
    );
  });
  it("returns review lessons after finishing the full catalogue", () => {
    const state = emptyLearnerState();
    for (const lesson of lessons)
      state.attempts = completeLesson(state.attempts, lesson, date);
    expect(buildLearningPath(null, state).lessonIds).toHaveLength(6);
  });
  it("spaces remembered words and resets forgotten words without exceeding the cap", () => {
    const first = scheduleReview("word", undefined, true, date);
    expect(first.intervalDays).toBe(1);
    expect(first.due).toBe("2026-10-25T06:00:00.000Z");
    expect(scheduleReview("word", first, true, date).intervalDays).toBe(2);
    expect(
      scheduleReview("word", { ...first, intervalDays: 180 }, true, date)
        .intervalDays,
    ).toBe(180);
    expect(scheduleReview("word", first, false, date)).toMatchObject({
      intervalDays: 1,
      repetitions: 0,
    });
  });
});
