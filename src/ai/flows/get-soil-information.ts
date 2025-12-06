'use server';
/**
 * @fileOverview A flow to get detailed information about a specific soil type.
 *
 * - getSoilInformation - A function that returns characteristics, suitable crops, and nutrient advice.
 * - GetSoilInformationInput - The input type for the function.
 * - GetSoilInformationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GetSoilInformationInputSchema = z.object({
  soilType: z.string().describe('The type of soil (e.g., "Loamy", "Black", "Alluvial").'),
  preferredLanguage: z.string().describe("The user's preferred language for the response."),
});
export type GetSoilInformationInput = z.infer<typeof GetSoilInformationInputSchema>;

const GetSoilInformationOutputSchema = z.object({
    characteristics: z.string().describe("A brief description of the soil's key characteristics (texture, water retention, etc.)."),
    suitableCrops: z.string().describe("A comma-separated list of crops that grow well in this soil type."),
    nutrientRecommendations: z.string().describe("Advice on common nutrient deficiencies and recommendations for organic and chemical fertilizers to improve yield."),
});
export type GetSoilInformationOutput = z.infer<typeof GetSoilInformationOutputSchema>;


export async function getSoilInformation(input: GetSoilInformationInput): Promise<GetSoilInformationOutput> {
  return getSoilInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getSoilInformationPrompt',
  input: {schema: GetSoilInformationInputSchema},
  output: {schema: GetSoilInformationOutputSchema},
  prompt: `You are an expert soil scientist providing advice to a farmer in India. The user wants to know about their soil type.

  **CRITICAL INSTRUCTION:** You MUST generate all advisory text *ENTIRELY* in the user's specified language: **{{{preferredLanguage}}}**.

  **Soil Type:** {{{soilType}}}

  Based on this soil type, provide the following information in a concise and easy-to-understand manner for a farmer:
  1.  **Characteristics:** Briefly describe the main properties of this soil (e.g., texture, color, water holding capacity, aeration).
  2.  **Suitable Crops:** List several common crops that are well-suited for this soil type in the Indian context.
  3.  **Nutrient Recommendations:** Describe common nutrient deficiencies found in this soil and suggest actionable steps to improve fertility and crop yield. Mention both organic (like compost, manure) and chemical (like NPK ratios, specific micronutrients) amendments.
  `,
  model: 'googleai/gemini-2.5-flash',
});

const getSoilInformationFlow = ai.defineFlow(
  {
    name: 'getSoilInformationFlow',
    inputSchema: GetSoilInformationInputSchema,
    outputSchema: GetSoilInformationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
