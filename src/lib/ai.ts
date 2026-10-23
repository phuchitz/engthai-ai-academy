import { z } from "zod";
import { levels } from "./models";

// Shared contract for the AI tutor. Model calls run only in /api/tutor on the server; the
// browser never sees API keys. Learner text is untrusted input and is bounded here.
export const TUTOR_INPUT_LIMIT = 1200;
export const CONVERSATION_TURN_LIMIT = 12;

export const conversationScenarios = [
  {
    id: "cafe",
    title: "Ordering at a cafe",
    thai: "สั่งเครื่องดื่มที่ร้านกาแฟ",
    role: "a friendly barista at a small Bangkok cafe",
    opener: "Hi there! What can I get for you today?",
  },
  {
    id: "hotel",
    title: "Checking in at a hotel",
    thai: "เช็กอินที่โรงแรม",
    role: "a hotel receptionist",
    opener: "Good afternoon, and welcome! Do you have a reservation with us?",
  },
  {
    id: "standup",
    title: "Daily stand-up meeting",
    thai: "ประชุมอัปเดตงานประจำวัน",
    role: "a team lead running a software team's daily stand-up",
    opener: "Morning! What did you work on yesterday, and what's next today?",
  },
  {
    id: "interview",
    title: "Job interview",
    thai: "สัมภาษณ์งาน",
    role: "a friendly interviewer for an office job",
    opener: "Thanks for coming in. Could you tell me a little about yourself?",
  },
] as const;
export type ScenarioId = (typeof conversationScenarios)[number]["id"];
const scenarioIds = conversationScenarios.map((s) => s.id) as [
  ScenarioId,
  ...ScenarioId[],
];

const learnerText = z.string().trim().min(1).max(TUTOR_INPUT_LIMIT);
const common = {
  explainIn: z.enum(["th", "en"]),
  level: z.enum(levels).nullable(),
};
export const tutorRequestSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("ask"), text: learnerText, ...common }),
  z.object({ mode: z.literal("writing"), text: learnerText, ...common }),
  z.object({
    mode: z.literal("conversation"),
    scenario: z.enum(scenarioIds),
    history: z
      .array(
        z.object({ role: z.enum(["partner", "learner"]), text: learnerText }),
      )
      .min(1)
      .max(CONVERSATION_TURN_LIMIT),
    ...common,
  }),
]);
export type TutorRequest = z.infer<typeof tutorRequestSchema>;
export type TutorMode = TutorRequest["mode"];

// Output schemas are what the model must return. Length limits are applied after parsing.
export const askOutputSchema = z.object({
  answer: z.string(),
  examples: z.array(z.string()),
  uncertainty: z.string().nullable(),
});
export const writingOutputSchema = z.object({
  correctedText: z.string(),
  overall: z.string(),
  issues: z.array(
    z.object({
      original: z.string(),
      suggestion: z.string(),
      explanation: z.string(),
      category: z.enum(["grammar", "vocabulary", "spelling", "clarity"]),
    }),
  ),
  strengths: z.array(z.string()),
  limitations: z.string(),
});
export const conversationOutputSchema = z.object({
  reply: z.string(),
  feedback: z.string().nullable(),
  betterPhrase: z.string().nullable(),
  finished: z.boolean(),
});
export type AskOutput = z.infer<typeof askOutputSchema>;
export type WritingOutput = z.infer<typeof writingOutputSchema>;
export type ConversationOutput = z.infer<typeof conversationOutputSchema>;

export type TutorResponse =
  | { mode: "ask"; result: AskOutput; remaining: number }
  | { mode: "writing"; result: WritingOutput; remaining: number }
  | { mode: "conversation"; result: ConversationOutput; remaining: number };

export type TutorErrorCode =
  | "not-configured"
  | "unauthenticated"
  | "invalid-request"
  | "rate-limited"
  | "busy"
  | "timeout"
  | "declined"
  | "unavailable";

export interface TutorStatus {
  configured: boolean;
  remaining: number;
  dailyLimit: number;
}
