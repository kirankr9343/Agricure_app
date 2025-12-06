'use server';
/**
 * @fileOverview A flow to perform reverse geocoding.
 *
 * - reverseGeocode - A function that takes coordinates and returns address components.
 * - ReverseGeocodeInput - The input type for the reverseGeocode function.
 * - ReverseGeocodeOutput - The return type for the reverseGeocode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ReverseGeocodeInputSchema = z.object({
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});
export type ReverseGeocodeInput = z.infer<typeof ReverseGeocodeInputSchema>;

const ReverseGeocodeOutputSchema = z.object({
    state: z.string().describe('The state or union territory.'),
    district: z.string().describe('The district or major city.'),
    village: z.string().describe('The village, sub-district, or specific named area.'),
    pincode: z.string().describe('The postal code (PIN code).'),
});
export type ReverseGeocodeOutput = z.infer<typeof ReverseGeocodeOutputSchema>;

export async function reverseGeocode(input: ReverseGeocodeInput): Promise<ReverseGeocodeOutput> {
  // In a real app, you might use a dedicated geocoding API here.
  // For this prototype, we'll use a powerful model to get the data.
  // Using a powerful model is expensive. For production, consider using a geocoding service.
  return reverseGeocodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reverseGeocodePrompt',
  input: {schema: ReverseGeocodeInputSchema},
  output: {schema: ReverseGeocodeOutputSchema},
  prompt: `Based on the provided latitude and longitude, identify the State (or Union Territory), District (or major city), the specific Village/Town/Area, and the postal code (PIN code) for that exact location in India.
  
  Latitude: {{{latitude}}}
  Longitude: {{{longitude}}}

  Provide only the requested fields. For 'village', provide the most specific local name available.
  `,
  model: 'googleai/gemini-2.5-flash', // A powerful model is needed for this task.
});

const reverseGeocodeFlow = ai.defineFlow(
  {
    name: 'reverseGeocodeFlow',
    inputSchema: ReverseGeocodeInputSchema,
    outputSchema: ReverseGeocodeOutputSchema,
  },
  async input => {
    try {
        const {output} = await prompt(input);
        return output!;
    } catch (error) {
        console.error("Reverse geocoding failed", error);
        // Fallback to a mock response if the AI fails
        return {
            state: "Not Found",
            district: "Not Found",
            village: "Not Found",
            pincode: "000000"
        }
    }
  }
);
