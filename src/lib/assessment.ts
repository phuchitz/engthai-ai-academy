import {
  levels,
  skills,
  type AssessmentAnswer,
  type AssessmentQuestion,
  type AssessmentResult,
  type AssessedSkill,
  type Level,
  type SkillEvaluation,
} from "./models";
import { questions } from "./questions";

export const QUESTIONS_PER_SKILL = 6;
export const ASSESSMENT_LENGTH = 18;
const testedSkills: AssessedSkill[] = ["grammar", "vocabulary", "reading"];

// Only answers to known questions count; the first answer to each item is final.
export function validAnswers(answers: AssessmentAnswer[]) {
  const seen = new Set<string>();
  return answers.filter((a) => {
    if (
      seen.has(a.questionId) ||
      !questions.some((q) => q.id === a.questionId) ||
      !Number.isInteger(a.option) ||
      a.option < 0 ||
      a.option > 3
    )
      return false;
    seen.add(a.questionId);
    return true;
  });
}

// FNV-1a: a stable, non-cryptographic hash so a session seed always picks the same item.
function stableHash(text: string) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// A seed (the session ID) varies items between sessions; without one, bank order is used.
export function nextQuestion(
  answers: AssessmentAnswer[],
  seed?: string,
): AssessmentQuestion | null {
  const valid = validAnswers(answers);
  const skill = testedSkills.find(
    (s) =>
      valid.filter(
        (a) => questions.find((q) => q.id === a.questionId)?.skill === s,
      ).length < QUESTIONS_PER_SKILL,
  );
  if (!skill) return null;
  const previous = valid.filter(
    (a) => questions.find((q) => q.id === a.questionId)?.skill === skill,
  );
  let difficulty = 1; // A2. Two correct items at a level move upward; a miss moves downward.
  let streak = 0;
  for (const answer of previous) {
    const item = questions.find((q) => q.id === answer.questionId)!;
    if (item.correct === answer.option) {
      streak++;
      if (streak >= 2) {
        difficulty = Math.min(3, levels.indexOf(item.level) + 1);
        streak = 0;
      }
    } else {
      difficulty = Math.max(0, levels.indexOf(item.level) - 1);
      streak = 0;
    }
  }
  const remaining = questions.filter(
    (q) => q.skill === skill && !valid.some((a) => a.questionId === q.id),
  );
  if (!remaining.length) return null;
  const distance = (q: AssessmentQuestion) =>
    Math.abs(levels.indexOf(q.level) - difficulty);
  const nearest = Math.min(...remaining.map(distance));
  const candidates = remaining.filter((q) => distance(q) === nearest);
  const index = seed
    ? stableHash(`${seed}:${skill}:${previous.length}`) % candidates.length
    : 0;
  return candidates[index];
}

export function scoreAssessment(answers: AssessmentAnswer[]): AssessmentResult {
  const valid = validAnswers(answers);
  const evaluations: SkillEvaluation[] = skills.map((skill) => {
    const items = questions.filter(
      (q) => q.skill === skill && valid.some((a) => a.questionId === q.id),
    );
    const correct = items.filter(
      (q) => valid.find((a) => a.questionId === q.id)?.option === q.correct,
    );
    // Two successful, distinct items at a level are required. A lower-level miss caps the estimate.
    let supported: Level | null = null;
    for (const level of levels.slice(0, 4)) {
      const atLevel = items.filter((q) => q.level === level);
      const lowerErrors = items.some(
        (q) =>
          levels.indexOf(q.level) < levels.indexOf(level) &&
          !correct.includes(q),
      );
      if (
        atLevel.length >= 2 &&
        atLevel.every((q) => correct.includes(q)) &&
        !lowerErrors
      )
        supported = level;
    }
    return {
      skill,
      level: items.length >= 4 ? supported : null,
      correct: correct.length,
      total: items.length,
      evidence:
        items.length === 0
          ? "not-assessed"
          : items.length >= 4
            ? "preliminary"
            : "limited",
      gaps: [
        ...new Set(
          items.filter((q) => !correct.includes(q)).map((q) => q.objective),
        ),
      ],
    };
  });
  const tested = evaluations.filter((e) =>
    testedSkills.includes(e.skill as AssessedSkill),
  );
  const estimatedLevel = tested.every((e) => e.level && e.total >= 4)
    ? tested
        .map((e) => e.level!)
        .sort((a, b) => levels.indexOf(a) - levels.indexOf(b))[0]
    : null;
  return {
    estimatedLevel,
    evaluations,
    strengths: tested
      .filter((e) => e.level)
      .map(
        (e) =>
          `${e.skill[0].toUpperCase()}${e.skill.slice(1)} recognition at ${e.level}`,
      ),
    priorities: [...new Set(tested.flatMap((e) => e.gaps))].slice(0, 4),
    coverage: evaluations.filter((e) => e.total >= 4).length,
  };
}
