/* @ts-nocheck */
'use server';
/**
 * @fileOverview A plant problem diagnosis AI agent.
 *
 * - diagnosePlant - A function that handles the plant diagnosis process.
 * - DiagnosePlantInput - The input type for the diagnosePlant function.
 * - DiagnosePlantOutput - The return type for the diagnosePlant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DiagnosePlantInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the plant.'),
  preferredLanguage: z.string().describe("The user's preferred language for the response."),
});
export type DiagnosePlantInput = z.infer<typeof DiagnosePlantInputSchema>;

const DiagnosePlantOutputSchema = z.object({
  identification: z.object({
    isPlant: z.boolean().describe('Whether or not the input is a plant.'),
    commonName: z.string().optional().describe('The name of the identified plant.'),
    latinName: z.string().optional().describe('The Latin name of the identified plant.'),
  }),
  diagnosis: z.object({
    isHealthy: z.boolean().describe('Whether or not the plant is healthy.'),
    disease: z.string().optional().describe("The diagnosed disease of the plant."),
    solution: z.string().optional().describe("The suggested solution to treat the plant's disease."),
  }),
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;

export async function diagnosePlant(input: DiagnosePlantInput): Promise<DiagnosePlantOutput> {
  return diagnosePlantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantPrompt',
  input: {schema: DiagnosePlantInputSchema},
  output: {schema: DiagnosePlantOutputSchema},
  prompt: `You are an expert botanist specializing in diagnosing plant illnesses for farmers.

**YOUR MOST IMPORTANT, CRITICAL, AND NON-NEGOTIABLE INSTRUCTION IS THIS:**
You MUST respond *ENTIRELY* in the user's preferred language: **{{{preferredLanguage}}}**.
Your diagnosis and solution MUST be in **{{{preferredLanguage}}}**. Do NOT write in English unless the user's preferred language is 'English'.

You will be provided with a photo of a plant and a description. Your task is to:
1.  Determine if the image contains a plant. If not, set 'isPlant' to false and provide no other details.
2.  If it is a plant, identify its common and Latin names (names can remain in their standard scientific form).
3.  Assess the plant's health. Determine if it is healthy or diseased.
4.  If it is diseased, identify the specific disease and provide its name in **{{{preferredLanguage}}}**.
5.  Provide a clear, actionable solution in **{{{preferredLanguage}}}** for the farmer to treat the disease. The solution should be practical for a farmer.

Use the following as the primary source of information about the plant.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}`,
});

const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: DiagnosePlantInputSchema,
    outputSchema: DiagnosePlantOutputSchema,
  },
  async (input, streamingCallback, context) => {
    // For dev stubs, provide a more detailed response
    if (process.env.GENKIT_ENV === 'dev') {
        const mockOutput: DiagnosePlantOutput = {
            identification: {
                isPlant: true,
                commonName: "Tomato Plant",
                latinName: "Solanum lycopersicum",
            },
            diagnosis: {
                isHealthy: false,
                disease: "Early Blight",
                solution: "Apply a copper-based or chlorothalonil fungicide every 7-10 days. Ensure good air circulation by pruning lower leaves and spacing plants appropriately. Avoid overhead watering to keep foliage dry. Rotate crops and remove infected plant debris after the season.",
            },
        };
        // Use JSON.stringify and parse to ensure it matches the schema type exactly
        return JSON.parse(JSON.stringify(mockOutput));
    }
    
    // Add retry logic for when the model is overloaded.
    const maxRetries = 3;
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const {output} = await prompt(input);
        return output!;
      } catch (e: any) {
        attempt++;
        // Only retry on 503 Service Unavailable errors.
        if (e.message?.includes('503') && attempt < maxRetries) {
          console.log(`Attempt ${attempt} failed. Retrying in 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          // For other errors or if max retries are reached, throw the error.
          throw e;
        }
      }
    }
    // This line should not be reachable, but is here for type safety.
    throw new Error("Plant diagnosis failed after multiple retries.");
  }
);
