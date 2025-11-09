'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing context-specific conversation coaching.
 *
 * The flow takes a question about how to talk to someone and provides advice,
 * conversation starters, and tips for engaging in meaningful dialogue.
 *
 * @exports {function} conversationCoaching - The main function to initiate the conversation coaching flow.
 * @exports {type} ConversationCoachingInput - The input type for the conversationCoaching function.
 * @exports {type} ConversationCoachingOutput - The output type for the conversationCoaching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConversationCoachingInputSchema = z.object({
  question: z.string().describe('The user question about how to talk to someone.'),
  context: z.string().optional().describe('The context of the conversation (e.g., first meeting, ongoing relationship).'),
});
export type ConversationCoachingInput = z.infer<typeof ConversationCoachingInputSchema>;

const ConversationCoachingOutputSchema = z.object({
  advice: z.string().describe('Context-specific advice on how to talk to someone.'),
  conversationStarters: z.array(z.string()).describe('Example conversation starters.'),
  tips: z.string().describe('Tips for engaging in meaningful dialogue.'),
});
export type ConversationCoachingOutput = z.infer<typeof ConversationCoachingOutputSchema>;

export async function conversationCoaching(input: ConversationCoachingInput): Promise<ConversationCoachingOutput> {
  return conversationCoachingFlow(input);
}

const conversationCoachingPrompt = ai.definePrompt({
  name: 'conversationCoachingPrompt',
  input: {schema: ConversationCoachingInputSchema},
  output: {schema: ConversationCoachingOutputSchema},
  prompt: `You are a relationship expert helping a young person learn to communicate better in romantic situations. Your user might speak in English, Hindi, or a mix of both (Hinglish, e.g., "Mujhe batao kiss topic me conversation start karni chahiye?"). Analyze the user's question to determine their language and respond in the same style. Provide practical, culturally appropriate advice for an Indian youth audience.

  Context: {{{context}}}

  Question: {{{question}}}

  Respond with:
  - advice: Context-specific advice on how to talk to someone.
  - conversationStarters: Example conversation starters.
  - tips: Tips for engaging in meaningful dialogue.
`,
});

const conversationCoachingFlow = ai.defineFlow(
  {
    name: 'conversationCoachingFlow',
    inputSchema: ConversationCoachingInputSchema,
    outputSchema: ConversationCoachingOutputSchema,
  },
  async input => {
    const {output} = await conversationCoachingPrompt(input);
    return output!;
  }
);
