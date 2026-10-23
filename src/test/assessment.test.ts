import { describe, expect, it } from "vitest";
import {
  ASSESSMENT_LENGTH,
  nextQuestion,
  scoreAssessment,
  validAnswers,
} from "@/lib/assessment";
import { questions } from "@/lib/questions";
import type { AssessmentAnswer } from "@/lib/models";

describe("adaptive preliminary assessment", () => {
  it("starts at A2 and never repeats an item across an 18-answer session", () => {
    const answers: AssessmentAnswer[] = [];
    expect(nextQuestion(answers)?.level).toBe("A2");
    for (let i = 0; i < ASSESSMENT_LENGTH; i++) {
      const item = nextQuestion(answers)!;
      expect(item).not.toBeNull();
      expect(answers.some((a) => a.questionId === item.id)).toBe(false);
      answers.push({ questionId: item.id, option: item.correct });
    }
    expect(nextQuestion(answers)).toBeNull();
    expect(new Set(answers.map((a) => a.questionId)).size).toBe(18);
    expect(scoreAssessment(answers).estimatedLevel).toBe("B2");
  });
  it("drops difficulty after a wrong answer and requires two successes before rising", () => {
    const first = nextQuestion([])!;
    expect(
      nextQuestion([{ questionId: first.id, option: (first.correct + 1) % 4 }])
        ?.level,
    ).toBe("A1");
    const correct = [{ questionId: first.id, option: first.correct }];
    const second = nextQuestion(correct)!;
    expect(second.level).toBe("A2");
    expect(
      nextQuestion([
        ...correct,
        { questionId: second.id, option: second.correct },
      ])?.level,
    ).toBe("B1");
  });
  it("treats empty and sparse evidence as insufficient", () => {
    expect(scoreAssessment([])).toMatchObject({
      estimatedLevel: null,
      coverage: 0,
    });
    const answers = questions
      .filter((q) => q.skill === "grammar" && q.level === "B2")
      .slice(0, 2)
      .map((q) => ({ questionId: q.id, option: q.correct }));
    expect(scoreAssessment(answers).evaluations[0].level).toBeNull();
    expect(scoreAssessment(answers).estimatedLevel).toBeNull();
  });
  it("does not equate a percentage with a CEFR level or claim untested skills", () => {
    const low = questions
      .filter((q) => ["A1", "A2"].includes(q.level))
      .map((q) => ({ questionId: q.id, option: q.correct }));
    const high = questions
      .filter((q) => ["B1", "B2"].includes(q.level))
      .map((q) => ({ questionId: q.id, option: q.correct }));
    expect(scoreAssessment(low).estimatedLevel).toBe("A2");
    expect(scoreAssessment(high).estimatedLevel).toBe("B2");
    expect(
      scoreAssessment(high)
        .evaluations.slice(3)
        .every((e) => e.level === null && e.evidence === "not-assessed"),
    ).toBe(true);
  });
  it("caps higher-level claims when lower-level answers contradict them", () => {
    const answers = questions
      .filter((q) => q.skill === "grammar")
      .map((q) => ({
        questionId: q.id,
        option: q.level === "A2" ? (q.correct + 1) % 4 : q.correct,
      }));
    expect(scoreAssessment(answers).evaluations[0].level).toBe("A1");
    expect(scoreAssessment(answers).priorities).toContain(
      "Talk about finished past events",
    );
  });
  it("ignores unknown, repeated, and invalid answers rather than inflating evidence", () => {
    const item = questions[0];
    const valid = { questionId: item.id, option: item.correct };
    expect(
      validAnswers([
        valid,
        valid,
        { questionId: "invented", option: 0 },
        { questionId: questions[1].id, option: 4 },
        { questionId: questions[2].id, option: 1.5 },
      ]),
    ).toEqual([valid]);
  });
  it("completes even when every answer is incorrect and does not invent an A1 estimate", () => {
    const answers: AssessmentAnswer[] = [];
    for (let i = 0; i < ASSESSMENT_LENGTH; i++) {
      const item = nextQuestion(answers)!;
      expect(item).not.toBeNull();
      answers.push({ questionId: item.id, option: (item.correct + 1) % 4 });
    }
    expect(nextQuestion(answers)).toBeNull();
    expect(scoreAssessment(answers).estimatedLevel).toBeNull();
    expect(scoreAssessment(answers).coverage).toBe(3);
  });
  it("has valid answer keys and unique identifiers throughout the bank", () => {
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
    for (const q of questions) {
      expect(q.options[q.correct]).toBeTruthy();
      expect(q.objective).toBeTruthy();
      expect(q.explanation).toBeTruthy();
    }
  });
});
