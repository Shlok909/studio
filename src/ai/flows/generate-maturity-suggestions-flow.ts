'use server';

/**
 * @fileOverview Generates personalized maturity suggestions for users.
 *
 * - generateMaturitySuggestions - A function that generates maturity suggestions.
 * - MaturitySuggestionsInput - The input type for the generateMaturitySuggestions function.
 * - MaturitySuggestionsOutput - The return type for the generateMaturitySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MaturitySuggestionsInputSchema = z.object({
  communicationStyle: z
    .string()
    .describe(
      "The user's current communication style, including examples of their messaging habits, grammar, and use of emojis."
    ),
  emotionalIntelligence: z
    .string()
    .describe(
      "Description of the user's current emotional intelligence, including their ability to recognize boundaries and handle disagreements."
    ),
  behaviorPatterns: z
    .string()
    .describe(
      "Description of the user's behavior patterns in relationships, including responsibility and reliability."
    ),
});
export type MaturitySuggestionsInput = z.infer<typeof MaturitySuggestionsInputSchema>;

const MaturitySuggestionsOutputSchema = z.object({
  communicationImprovements: z
    .string()
    .describe(
      'Suggestions for improving communication style, such as avoiding excessive emojis and using proper grammar.'
    ),
  emotionalIntelligenceTips: z
    .string()
    .describe(
      'Tips for improving emotional intelligence, such as recognizing and respecting boundaries and handling disagreements constructively.'
    ),
  conversationDepthSuggestions: z
    .string()
    .describe(
      'Suggestions for moving beyond surface-level topics in conversations and engaging in more meaningful discussions.'
    ),
  responsibilityDemonstrations: z
    .string()
    .describe(
      'Recommendations for demonstrating responsibility and reliability in relationships, such as keeping commitments and being punctual.'
    ),
  personalGrowthRecommendations: z
    .string()
    .describe(
      'Recommendations for personal growth activities that can enhance maturity, such as pursuing hobbies, expanding knowledge, and focusing on career goals.'
    ),
});
export type MaturitySuggestionsOutput = z.infer<typeof MaturitySuggestionsOutputSchema>;

export async function generateMaturitySuggestions(
  input: MaturitySuggestionsInput
): Promise<MaturitySuggestionsOutput> {
  return generateMaturitySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'maturitySuggestionsPrompt',
  input: {schema: MaturitySuggestionsInputSchema},
  output: {schema: MaturitySuggestionsOutputSchema},
  prompt: `You are a relationship coach providing personalized advice to help users present themselves more maturely in relationships.

  Based on the user's current communication style, emotional intelligence, and behavior patterns, provide specific and actionable suggestions for improvement.

  Communication Style: {{{communicationStyle}}}
  Emotional Intelligence: {{{emotionalIntelligence}}}
  Behavior Patterns: {{{behaviorPatterns}}}

  Focus on the following areas:
  - Communication Improvements: Suggestions for improving communication style, such as avoiding excessive emojis, using proper grammar, and crafting thoughtful responses.
  - Emotional Intelligence Tips: Tips for improving emotional intelligence, such as recognizing and respecting boundaries and handling disagreements constructively.
  - Conversation Depth Suggestions: Suggestions for moving beyond surface-level topics in conversations and engaging in more meaningful discussions.
  - Responsibility Demonstrations: Recommendations for demonstrating responsibility and reliability in relationships, such as keeping commitments, being punctual, and showing consistent support.
  - Personal Growth Recommendations: Recommendations for personal growth activities that can enhance maturity, such as pursuing hobbies, expanding knowledge, and focusing on career goals.

  Provide the output in the format specified by the output schema, creating descriptive sentences that a user can easily understand and implement.
`,
});

const generateMaturitySuggestionsFlow = ai.defineFlow(
  {
    name: 'generateMaturitySuggestionsFlow',
    inputSchema: MaturitySuggestionsInputSchema,
    outputSchema: MaturitySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
