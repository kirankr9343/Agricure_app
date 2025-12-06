'use server';
/**
 * @fileOverview A flow to get address suggestions for autocomplete.
 *
 * - getAddressSuggestions - A function that returns a list of address predictions.
 * - GetAddressSuggestionsInput - The input type for the function.
 * - GetAddressSuggestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AddressSuggestionSchema = z.object({
    fullAddress: z.string().describe("The full, formatted address string for display."),
    village: z.string().describe("The village, sub-district, or specific named area."),
    district: z.string().describe("The district or major city."),
    state: z.string().describe("The state or union territory."),
    pincode: z.string().describe("The postal code (PIN code)."),
    latitude: z.number().describe("The latitude of the location."),
    longitude: z.number().describe("The longitude of the location."),
});

const GetAddressSuggestionsInputSchema = z.object({
  query: z.string().describe('The partial address query from the user.'),
  country: z.string().optional().default('India').describe('The country to search within.'),
});
export type GetAddressSuggestionsInput = z.infer<typeof GetAddressSuggestionsInputSchema>;

const GetAddressSuggestionsOutputSchema = z.object({
    suggestions: z.array(AddressSuggestionSchema).describe('A list of address suggestions.'),
});
export type GetAddressSuggestionsOutput = z.infer<typeof GetAddressSuggestionsOutputSchema>;

export async function getAddressSuggestions(input: GetAddressSuggestionsInput): Promise<GetAddressSuggestionsOutput> {
  // Using a powerful model is expensive. For production, use a dedicated Places API.
  return getAddressSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getAddressSuggestionsPrompt',
  input: {schema: GetAddressSuggestionsInputSchema},
  output: {schema: GetAddressSuggestionsOutputSchema},
  prompt: `You are a geocoding assistant. Based on the user's partial address query for a location in {{{country}}}, provide up to 5 detailed address suggestions. For each suggestion, provide the full address text, and also break it down into village/area, district, state, pincode, and precise lat/lng coordinates.

  User Query: "{{{query}}}"
  `,
  model: 'googleai/gemini-2.5-flash',
});

const getAddressSuggestionsFlow = ai.defineFlow(
  {
    name: 'getAddressSuggestionsFlow',
    inputSchema: GetAddressSuggestionsInputSchema,
    outputSchema: GetAddressSuggestionsOutputSchema,
  },
  async input => {
    if (!input.query || input.query.length < 3) {
        return { suggestions: [] };
    }
    try {
        const {output} = await prompt(input);
        return output || { suggestions: [] };
    } catch (error) {
        console.error("Address suggestion flow failed", error);
        return { suggestions: [] };
    }
  }
);
