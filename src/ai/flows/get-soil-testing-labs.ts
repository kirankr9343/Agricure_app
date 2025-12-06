
/* @ts-nocheck */
'use server';
/**
 * @fileOverview A flow to get a list of soil testing labs near a specific location.
 *
 * - getSoilTestingLabs - A function that returns a list of labs.
 * - GetSoilTestingLabsInput - The input type for the function.
 * - GetSoilTestingLabsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const LabSchema = z.object({
    name: z.string().describe("The full name of the soil testing laboratory."),
    city: z.string().describe("The city and state where the lab is located."),
    phone: z.string().describe("A contact phone number for the lab."),
    address: z.string().describe("The physical address of the lab."),
});

const GetSoilTestingLabsInputSchema = z.object({
  location: z.string().describe('The district and state in India for which to find soil testing labs (e.g., "Bangalore, Karnataka").'),
});
export type GetSoilTestingLabsInput = z.infer<typeof GetSoilTestingLabsInputSchema>;

const GetSoilTestingLabsOutputSchema = z.object({
    labs: z.array(LabSchema).describe('A list of 5-6 soil testing laboratories near the specified location.'),
});
export type GetSoilTestingLabsOutput = z.infer<typeof GetSoilTestingLabsOutputSchema>;


export async function getSoilTestingLabs(input: GetSoilTestingLabsInput): Promise<GetSoilTestingLabsOutput> {
  return getSoilTestingLabsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getSoilTestingLabsPrompt',
  input: {schema: GetSoilTestingLabsInputSchema},
  output: {schema: GetSoilTestingLabsOutputSchema},
  prompt: `You are an Indian agricultural directory assistant. Your task is to provide a list of 5-6 real or highly realistic soil testing laboratories located within a 100km radius of the specified location. The location is given as "District, State".

  For each lab, provide its name, city (including state), a plausible contact phone number, and a physical address. Ensure the results are geographically relevant and accurate for the given location. For example, if the location is "Bangalore", only provide labs in or very near Bangalore.

  Location: {{{location}}}
  `,
  model: 'googleai/gemini-2.5-flash',
});

const getSoilTestingLabsFlow = ai.defineFlow(
  {
    name: 'getSoilTestingLabsFlow',
    inputSchema: GetSoilTestingLabsInputSchema,
    outputSchema: GetSoilTestingLabsOutputSchema,
  },
  async (input, streamingCallback, context) => {
    // For dev stubs, provide a static list for a common location.
    if (process.env.GENKIT_ENV === 'dev' && input.location.includes("Pune")) {
        const mockOutput: GetSoilTestingLabsOutput = {
            labs: [
                { name: "Krishi Vigyan Kendra (KVK) Soil Lab", city: "Pune, Maharashtra", phone: "020-1122-4455", address: "456 Farm Road, Shivaji Nagar" },
                { name: "Agri-Tech Solutions Pvt. Ltd.", city: "Pune, Maharashtra", phone: "020-6655-8899", address: "111 Tech Park, Hinjewadi" },
                { name: "Deccan Soil Analytics", city: "Pune, Maharashtra", phone: "020-2233-4455", address: "789 Industrial Area, Pimpri" },
                { name: "Reliable Testing Services", city: "Pune, Maharashtra", phone: "020-5544-3322", address: "G-4, Market Yard, Gultekdi" },
                { name: "Green Earth Labs", city: "Pune, Maharashtra", phone: "020-7788-9900", address: "321 Bio-Tech Center, Aundh" },
                { name: "Maharashtra State Soil Survey", city: "Pune, Maharashtra", phone: "020-1234-5678", address: "Govt. Complex, Near Collector Office" }
            ]
        };
        return JSON.parse(JSON.stringify(mockOutput));
    }
    
    const {output} = await prompt(input);
    return output!;
  }
);
