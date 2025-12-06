'use server';
/**
 * @fileOverview A flow to validate if a district belongs to a state.
 *
 * - validateDistrict - A function that returns whether the district is valid for the state.
 * - ValidateDistrictInput - The input type for the function.
 * - ValidateDistrictOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ValidateDistrictInputSchema = z.object({
  district: z.string().describe('The name of the district to validate.'),
  state: z.string().describe('The name of the state the district should belong to.'),
});
export type ValidateDistrictInput = z.infer<typeof ValidateDistrictInputSchema>;

const ValidateDistrictOutputSchema = z.object({
    isValid: z.boolean().describe('Whether the given district is a real district within the specified state in India.'),
});
export type ValidateDistrictOutput = z.infer<typeof ValidateDistrictOutputSchema>;

export async function validateDistrict(input: ValidateDistrictInput): Promise<ValidateDistrictOutput> {
  // Use a cheaper, faster model for this simple validation task.
  return validateDistrictFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateDistrictPrompt',
  input: {schema: ValidateDistrictInputSchema},
  output: {schema: ValidateDistrictOutputSchema},
  prompt: `You are an expert Indian geography validator. Your only job is to determine if the provided district name exists within the provided state name. Be very strict.
  
  If the district '{{{district}}}' is a real, officially recognized district within the state of '{{{state}}}', set isValid to true.
  If it is not a recognized district in that state, or if either name is misspelled or gibberish, set isValid to false.

  District: {{{district}}}
  State: {{{state}}}
  `,
  model: 'googleai/gemini-2.5-flash',
});

const validateDistrictFlow = ai.defineFlow(
  {
    name: 'validateDistrictFlow',
    inputSchema: ValidateDistrictInputSchema,
    outputSchema: ValidateDistrictOutputSchema,
  },
  async input => {
    // Do not run for short inputs to save costs and avoid bogus checks.
    if (!input.district || input.district.length < 3 || !input.state || input.state.length < 3) {
      return { isValid: true }; // Default to true to not block the user unnecessarily
    }
    try {
        const {output} = await prompt(input);
        return output || { isValid: false };
    } catch (error) {
        console.error("AI district validation failed.", error);
        // Default to true to not block the user if the AI service fails.
        return { isValid: true };
    }
  }
);
