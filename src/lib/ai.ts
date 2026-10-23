import { z } from "zod";
// Contract for a future server-only gateway. No client API keys or simulated AI responses.
export const tutorResponseSchema = z.object({
  explanation: z.string().max(5000),
  examples: z.array(z.string().max(500)).max(5),
  uncertainty: z.string().max(500).optional(),
});
export const evaluationSchema = z.object({
  dimensions: z.array(
    z.object({
      dimension: z.string(),
      evidence: z.string(),
      feedback: z.string(),
    }),
  ),
  limitations: z.array(z.string()),
  requiresReview: z.boolean(),
});
export interface AIGateway {
  tutor(input: {
    text: string;
    accountId: string;
  }): Promise<z.infer<typeof tutorResponseSchema>>;
  examine(input: {
    text: string;
    rubricId: string;
    accountId: string;
  }): Promise<z.infer<typeof evaluationSchema>>;
}
