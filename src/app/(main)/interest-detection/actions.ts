"use server";

import { z } from "zod";
import {
  assessInterestLevel,
  type AssessInterestLevelOutput,
} from "@/ai/flows/assess-interest-level-flow";

const schema = z.object({
  frequencyOfInteraction: z.string().min(1, "This field is required."),
  bodyLanguageObserved: z.string().min(1, "This field is required."),
  responseTime: z.string().min(1, "This field is required."),
  conversationTopics: z.string().min(1, "This field is required."),
  personalInformationShared: z.string().min(1, "This field is required."),
  eyeContact: z.string().min(1, "This field is required."),
  smilingLaughingPatterns: z.string().min(1, "This field is required."),
  physicalProximityComfort: z.string().min(1, "This field is required."),
  mutualFriendInvolvement: z.string().min(1, "This field is required."),
});

export async function getInterestLevel(
  input: z.infer<typeof schema>
): Promise<{ data: AssessInterestLevelOutput | null; error: string | null }> {
  const validated = schema.safeParse(input);
  if (!validated.success) {
    const firstError = validated.error.errors[0].message;
    return { data: null, error: firstError };
  }

  try {
    const result = await assessInterestLevel(validated.data);
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      error: "Failed to get interest level. Please try again.",
    };
  }
}
