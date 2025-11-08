"use server";

import { z } from "zod";
import {
  generateMaturitySuggestions,
  type MaturitySuggestionsOutput,
} from "@/ai/flows/generate-maturity-suggestions-flow";

const schema = z.object({
  communicationStyle: z.string().min(1, "This field is required."),
  emotionalIntelligence: z.string().min(1, "This field is required."),
  behaviorPatterns: z.string().min(1, "This field is required."),
});

export async function getMaturitySuggestions(
  input: z.infer<typeof schema>
): Promise<{ data: MaturitySuggestionsOutput | null; error: string | null }> {
  const validated = schema.safeParse(input);
  if (!validated.success) {
    const firstError = validated.error.errors[0].message;
    return { data: null, error: firstError };
  }

  try {
    const result = await generateMaturitySuggestions(validated.data);
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      error: "Failed to get suggestions. Please try again.",
    };
  }
}
