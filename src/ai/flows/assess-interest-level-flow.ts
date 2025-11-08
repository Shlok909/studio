// AssessInterestLevelFromInteractions
'use server';
/**
 * @fileOverview Assesses the level of romantic interest based on user-provided interaction details.
 *
 * - assessInterestLevel - A function that takes interaction details as input and returns an assessment of interest level.
 * - AssessInterestLevelInput - The input type for the assessInterestLevel function.
 * - AssessInterestLevelOutput - The return type for the assessInterestLevel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessInterestLevelInputSchema = z.object({
  frequencyOfInteraction: z
    .string()
    .describe('How often do you interact with the person?'),
  bodyLanguageObserved: z
    .string()
    .describe('Describe their body language during interactions.'),
  responseTime: z
    .string()
    .describe('How quickly do they respond to your messages?'),
  conversationTopics: z
    .string()
    .describe('What topics do you usually talk about?'),
  personalInformationShared: z
    .string()
    .describe('How much personal information have they shared with you?'),
  eyeContact: z.string().describe('Describe their eye contact with you.'),
  smilingLaughingPatterns: z
    .string()
    .describe('How often do they smile or laugh when you are together?'),
  physicalProximityComfort: z
    .string()
    .describe('How comfortable do they seem with physical proximity?'),
  mutualFriendInvolvement: z
    .string()
    .describe('Are mutual friends involved in your interactions?'),
});
export type AssessInterestLevelInput = z.infer<
  typeof AssessInterestLevelInputSchema
>;

const AssessInterestLevelOutputSchema = z.object({
  interestLevel: z
    .number()
    .describe('A percentage indicating the level of romantic interest.'),
  positiveIndicators: z
    .string()
    .describe('Specific behavioral examples suggesting interest.'),
  negativeIndicators: z
    .string()
    .describe('Specific behavioral examples suggesting disinterest.'),
  nextStepsRecommendation: z
    .string()
    .describe('Recommended next steps based on the assessment.'),
});
export type AssessInterestLevelOutput = z.infer<
  typeof AssessInterestLevelOutputSchema
>;

export async function assessInterestLevel(
  input: AssessInterestLevelInput
): Promise<AssessInterestLevelOutput> {
  return assessInterestLevelFlow(input);
}

const assessInterestLevelPrompt = ai.definePrompt({
  name: 'assessInterestLevelPrompt',
  input: {schema: AssessInterestLevelInputSchema},
  output: {schema: AssessInterestLevelOutputSchema},
  prompt: `You are a relationship expert analyzing interaction patterns to determine romantic interest.

  Analyze the following interaction details:

  Frequency of Interaction: {{{frequencyOfInteraction}}}
  Body Language Observed: {{{bodyLanguageObserved}}}
  Response Time: {{{responseTime}}}
  Conversation Topics: {{{conversationTopics}}}
  Personal Information Shared: {{{personalInformationShared}}}
  Eye Contact: {{{eyeContact}}}
  Smiling/Laughing Patterns: {{{smilingLaughingPatterns}}}
  Physical Proximity Comfort: {{{physicalProximityComfort}}}
  Mutual Friend Involvement: {{{mutualFriendInvolvement}}}

  Based on these details, provide:
  - An interestLevel (as a percentage) indicating the likelihood of romantic interest.
  - positiveIndicators: Specific examples of behaviors suggesting interest.
  - negativeIndicators: Specific examples of behaviors suggesting disinterest.
  - nextStepsRecommendation:  Recommended next steps based on the assessment.

  Format your response as a JSON object matching the schema.`,
});

const assessInterestLevelFlow = ai.defineFlow(
  {
    name: 'assessInterestLevelFlow',
    inputSchema: AssessInterestLevelInputSchema,
    outputSchema: AssessInterestLevelOutputSchema,
  },
  async input => {
    const {output} = await assessInterestLevelPrompt(input);
    return output!;
  }
);
