'use server';
/**
 * @fileOverview A flow to get crop suggestions based on a location.
 *
 * - getCropSuggestions - A function that returns a list of crop suggestions.
 * - GetCropSuggestionsInput - The input type for the getCropSuggestions function.
 * - GetCropSuggestionsOutput - The return type for the getCropSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GetCropSuggestionsInputSchema = z.object({
  location: z.string().describe('The location (e.g., district, state in India) for which to suggest crops.'),
});
export type GetCropSuggestionsInput = z.infer<typeof GetCropSuggestionsInputSchema>;

const GetCropSuggestionsOutputSchema = z.object({
    suggestions: z.array(z.string()).describe('A list of 5-10 crop names suitable for the given location.'),
});
export type GetCropSuggestionsOutput = z.infer<typeof GetCropSuggestionsOutputSchema>;

export async function getCropSuggestions(input: GetCropSuggestionsInput): Promise<GetCropSuggestionsOutput> {
  return getCropSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getCropSuggestionsPrompt',
  input: {schema: GetCropSuggestionsInputSchema},
  output: {schema: GetCropSuggestionsOutputSchema},
  prompt: `You are a local agricultural expert for the specified district in India.
  Based on the provided location, suggest a list of 5 to 10 common, commercially viable, and geographically appropriate crops that are popularly grown in that specific district.
  For example, if the location is "Chikkamagalur, Karnataka", you should suggest crops like "Coffee", "Pepper", "Areca nut", "Rice", and "Ragi".
  Do not add any description, just the names of the crops.

  Location: {{{location}}}
  `,
});

const getCropSuggestionsFlow = ai.defineFlow(
  {
    name: 'getCropSuggestionsFlow',
    inputSchema: GetCropSuggestionsInputSchema,
    outputSchema: GetCropSuggestionsOutputSchema,
  },
  async input => {
    try {
        const {output} = await prompt(input);
        if (output && output.suggestions.length > 0) {
            return output;
        }
    } catch (error) {
        console.error("AI suggestion failed, using fallback.", error);
    }
    
    // Always return a mock list as a reliable fallback
    const mockOutput: GetCropSuggestionsOutput = {
        suggestions: ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Soybean", "Pulses", "Jute", "Mustard"]
    };
    return JSON.parse(JSON.stringify(mockOutput));
  }
);
