import { z } from "zod";

export const levels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type Level = (typeof levels)[number];
export const skills = [
  "grammar",
  "vocabulary",
  "reading",
  "listening",
  "writing",
  "speaking",
] as const;
export type Skill = (typeof skills)[number];
export type AssessedSkill = "grammar" | "vocabulary" | "reading";
export const goals = [
  "Everyday conversation",
  "Travel",
  "Work communication",
  "Software engineering",
  "English interviews",
  "General English",
] as const;
export const topics = [
  "Everyday life",
  "Technology",
  "Travel & culture",
  "Work & careers",
  "Food & coffee",
  "Books & ideas",
] as const;
export const preferencesSchema = z.object({
  displayName: z.string().trim().min(1, "Please enter your name").max(50),
  goals: z
    .array(z.enum(goals))
    .min(1, "Choose at least one goal")
    .max(goals.length),
  dailyMinutes: z.union([
    z.literal(10),
    z.literal(15),
    z.literal(20),
    z.literal(30),
  ]),
  topics: z
    .array(z.enum(topics))
    .min(1, "Choose at least one topic")
    .max(topics.length),
  motivation: z.string().trim().max(300),
});
export type UserPreferences = z.infer<typeof preferencesSchema>;
export interface User {
  id: string;
  name: string;
  email?: string;
}
export interface AssessmentQuestion {
  id: string;
  skill: AssessedSkill;
  level: Level;
  prompt: string;
  passage?: string;
  /** Thai task help that explains the question without revealing the answer. */
  thai?: string;
  options: [string, string, string, string];
  correct: number;
  explanation: string;
  objective: string;
}
export const answerSchema = z.object({
  questionId: z.string().max(80),
  option: z.number().int().min(0).max(3),
});
export type AssessmentAnswer = z.infer<typeof answerSchema>;
export interface AssessmentSession {
  id: string;
  startedAt: string;
  answers: AssessmentAnswer[];
  completedAt?: string;
}
export interface SkillEvaluation {
  skill: Skill;
  level: Level | null;
  correct: number;
  total: number;
  evidence: "limited" | "preliminary" | "not-assessed";
  gaps: string[];
}
export interface AssessmentResult {
  estimatedLevel: Level | null;
  evaluations: SkillEvaluation[];
  strengths: string[];
  priorities: string[];
  coverage: number;
}
export interface Lesson {
  id: string;
  title: string;
  skill: AssessedSkill;
  level: Level;
  minutes: number;
  objective: string;
  description: string;
  explanation: string;
  thai: string;
  examples: string[];
  exercise: {
    prompt: string;
    options: string[];
    correct: number;
    feedback: string;
  };
  xp: number;
}
export interface LearningPath {
  lessonIds: string[];
  reason: string;
}
export const lessonAttemptSchema = z.object({
  lessonId: z.string().max(80),
  completedAt: z.iso.datetime(),
  correct: z.boolean(),
  xp: z.number().int().min(0).max(100),
});
export type LessonAttempt = z.infer<typeof lessonAttemptSchema>;
export type Topic = (typeof topics)[number];
export interface VocabularyItem {
  id: string;
  word: string;
  thai: string;
  example: string;
  exampleThai: string;
  pronunciation: string;
  level: Level;
  topic: Topic;
}
export const vocabularyReviewSchema = z.object({
  itemId: z.string().max(80),
  due: z.iso.datetime(),
  intervalDays: z.number().int().min(1).max(180),
  repetitions: z.number().int().nonnegative(),
  introducedAt: z.iso.datetime().optional(),
});
export type VocabularyReview = z.infer<typeof vocabularyReviewSchema>;
export interface DailyProgress {
  date: string;
  xp: number;
  lessons: number;
}
export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}
export interface ConversationSession {
  id: string;
  role: "tutor" | "examiner" | "coach" | "conversation";
  messages: { role: "user" | "assistant"; content: string }[];
}
export const learnerStateSchema = z.object({
  version: z.literal(1),
  preferences: preferencesSchema.nullable(),
  assessment: z
    .object({
      id: z.string().max(80),
      startedAt: z.iso.datetime(),
      answers: z.array(answerSchema).max(24),
      completedAt: z.iso.datetime().optional(),
    })
    .nullable(),
  attempts: z.array(lessonAttemptSchema).max(5000),
  reviews: z.array(vocabularyReviewSchema).max(1000),
});
export type LearnerState = z.infer<typeof learnerStateSchema>;
export const emptyLearnerState = (): LearnerState => ({
  version: 1,
  preferences: null,
  assessment: null,
  attempts: [],
  reviews: [],
});
