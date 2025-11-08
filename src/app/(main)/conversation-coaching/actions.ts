"use server";

import { z } from "zod";
import {
  conversationCoaching,
  type ConversationCoachingOutput,
} from "@/ai/flows/conversation-coaching-flow";

const schema = z.object({
  question: z.string().min(1, { message: "Question cannot be empty." }),
  context: z.string().optional(),
});

export async function getCoaching(
  input: z.infer<typeof schema>
): Promise<{ data: ConversationCoachingOutput | null; error: string | null }> {
  const validated = schema.safeParse(input);
  if (!validated.success) {
    return { data: null, error: "Invalid input." };
  }

  try {
    const result = await conversationCoaching(validated.data);
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      error: "Failed to get coaching advice. Please try again.",
    };
  }
}
