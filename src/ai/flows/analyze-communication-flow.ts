'use server';

/**
 * @fileOverview This flow analyzes a user's intended message and provides feedback on its tone, appropriateness, and potential for misunderstandings.
 *
 * - analyzeCommunication - Analyzes the communication and returns feedback.
 * - AnalyzeCommunicationInput - The input type for the analyzeCommunication function.
 * - AnalyzeCommunicationOutput - The return type for the analyzeCommunication function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCommunicationInputSchema = z.object({
  message: z.string().describe('The message to be analyzed.'),
});
export type AnalyzeCommunicationInput = z.infer<typeof AnalyzeCommunicationInputSchema>;

const AnalyzeCommunicationOutputSchema = z.object({
  toneFeedback: z.string().describe('Feedback on the tone of the message.'),
  appropriatenessFeedback: z.string().describe('Feedback on the appropriateness of the message.'),
  misunderstandingPotential: z.string().describe('Potential for misunderstandings in the message.'),
  suggestedImprovements: z.string().describe('Suggested improvements for the message.'),
});
export type AnalyzeCommunicationOutput = z.infer<typeof AnalyzeCommunicationOutputSchema>;

export async function analyzeCommunication(input: AnalyzeCommunicationInput): Promise<AnalyzeCommunicationOutput> {
  return analyzeCommunicationFlow(input);
}

const analyzeCommunicationPrompt = ai.definePrompt({
  name: 'analyzeCommunicationPrompt',
  input: {schema: AnalyzeCommunicationInputSchema},
  output: {schema: AnalyzeCommunicationOutputSchema},
  prompt: `You are a relationship expert providing feedback on a user's intended message. Analyze the message for its tone, appropriateness, and potential for misunderstandings. Provide specific suggestions for improvement, keeping in mind that the user is an Indian youth seeking guidance on romantic relationships.

Message: {{{message}}}

Consider cultural context and potential sensitivities.
`,
});

const analyzeCommunicationFlow = ai.defineFlow(
  {
    name: 'analyzeCommunicationFlow',
    inputSchema: AnalyzeCommunicationInputSchema,
    outputSchema: AnalyzeCommunicationOutputSchema,
  },
  async input => {
    const {output} = await analyzeCommunicationPrompt(input);
    return output!;
  }
);
