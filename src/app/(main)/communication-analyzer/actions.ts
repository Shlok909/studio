"use server";

import { z } from "zod";
import {
  analyzeCommunication,
  type AnalyzeCommunicationOutput,
} from "@/ai/flows/analyze-communication-flow";

const schema = z.object({
  message: z
    .string()
    .min(5, { message: "Message must be at least 5 characters long." })
    .max(500, { message: "Message must be 500 characters or less." }),
});

export async function getAnalysis(
  input: z.infer<typeof schema>
): Promise<{ data: AnalyzeCommunicationOutput | null; error: string | null }> {
  const validated = schema.safeParse(input);
  if (!validated.success) {
    const firstError = validated.error.errors[0].message;
    return { data: null, error: firstError };
  }

  try {
    const result = await analyzeCommunication(validated.data);
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      error: "Failed to get analysis. Please try again.",
    };
  }
}
