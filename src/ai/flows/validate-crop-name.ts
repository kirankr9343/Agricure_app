'use server';
/**
 * @fileOverview A flow to validate if a given string is a real crop name.
 *
 * - validateCropName - A function that returns whether the input is a valid crop.
 * - ValidateCropNameInput - The input type for the validateCropName function.
 * - ValidateCropNameOutput - The return type for the validateCropName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ValidateCropNameInputSchema = z.object({
  cropName: z.string().describe('The name of the crop to validate.'),
});
export type ValidateCropNameInput = z.infer<typeof ValidateCropNameInputSchema>;

const ValidateCropNameOutputSchema = z.object({
    isValid: z.boolean().describe('Whether the given name is a valid, real-world agricultural crop.'),
});
export type ValidateCropNameOutput = z.infer<typeof ValidateCropNameOutputSchema>;

export async function validateCropName(input: ValidateCropNameInput): Promise<ValidateCropNameOutput> {
  // For dev stubs or if the input is obviously not a crop, return quickly.
  if (process.env.GENKIT_ENV === 'dev' || !input.cropName || input.cropName.length < 3) {
      if (["wheat", "rice", "maize", "cotton", "sugarcane"].includes(input.cropName.toLowerCase())) {
          return { isValid: true };
      }
      if (input.cropName.includes("test")) {
          return { isValid: true };
      }
  }
  return validateCropNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateCropNamePrompt',
  input: {schema: ValidateCropNameInputSchema},
  output: {schema: ValidateCropNameOutputSchema},
  prompt: `You are a crop name validator. Your only job is to determine if the provided text is a real agricultural crop.
  Do not be conversational.
  If the text is a valid crop (like "Wheat", "Sorghum", "Tomato", "Rice", "Sugarcane"), set isValid to true.
  If the text is gibberish (like "kjhkjh"), a non-crop item, or a sentence, set isValid to false.

  Crop Name: {{{cropName}}}
  `,
});

const validateCropNameFlow = ai.defineFlow(
  {
    name: 'validateCropNameFlow',
    inputSchema: ValidateCropNameInputSchema,
    outputSchema: ValidateCropNameOutputSchema,
  },
  async input => {
    try {
        const {output} = await prompt(input);
        return output || { isValid: false };
    } catch (error) {
        console.error("AI validation failed.", error);
        // Default to true to not block the user if the service fails.
        // The main advisory flows will handle any truly invalid names later.
        return { isValid: true };
    }
  }
);
