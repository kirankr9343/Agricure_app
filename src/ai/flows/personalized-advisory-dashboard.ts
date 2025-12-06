
/* @ts-nocheck */
'use server';

/**
 * @fileOverview A personalized advisory dashboard flow for farmers.
 *
 * - getPersonalizedAdvisoryDashboard - A function that returns a personalized advisory dashboard.
 * - PersonalizedAdvisoryDashboardInput - The input type for the getPersonalizedAdvisoryDashboard function.
 * - PersonalizedAdvisoryDashboardOutput - The return type for the getPersonalizedAdvisoryDashboard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedAdvisoryDashboardInputSchema = z.object({
  farmLocation: z
    .string()
    .describe('The location of the farm (e.g., city, state, or lat/long).'),
  soilType: z.string().describe('The type of soil on the farm.'),
  crops: z.array(z.string()).describe('The crops being grown on the farm.'),
  preferredLanguage: z
    .string()
    .describe('The farmer\'s preferred language.'),
});
export type PersonalizedAdvisoryDashboardInput = z.infer<
  typeof PersonalizedAdvisoryDashboardInputSchema
>;

const PersonalizedAdvisoryDashboardOutputSchema = z.object({
  weatherAdvisory: z.string().describe("A 7-day weather forecast and actionable advice for the specified crops and location. Include daily temperature (min/max), humidity, and chance of rain. The advice should be in the user's preferred language."),
  soilConditionAdvisory: z
    .string()
    .describe('A detailed advisory on soil conditions for the specified crops. Mention ideal pH, nutrient requirements (NPK), and suggest organic amendments. The advice must be in the preferred language.'),
  marketPriceAdvisory: z.string().describe('An advisory on current market prices for the specified crops in the given location. Provide estimated prices (e.g., per quintal) and suggest optimal selling times. The advice must be in the preferred language.'),
  diseaseRiskAdvisory: z.string().describe('An advisory on potential disease risks for the specified crops based on weather conditions. If a risk is high, provide clear, step-by-step preventative actions. The advice must be in the preferred language.'),
});
export type PersonalizedAdvisoryDashboardOutput = z.infer<
  typeof PersonalizedAdvisoryDashboardOutputSchema
>;

export async function getPersonalizedAdvisoryDashboard(
  input: PersonalizedAdvisoryDashboardInput
): Promise<PersonalizedAdvisoryDashboardOutput> {
  return personalizedAdvisoryDashboardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedAdvisoryDashboardPrompt',
  input: {schema: PersonalizedAdvisoryDashboardInputSchema},
  output: {schema: PersonalizedAdvisoryDashboardOutputSchema},
  prompt: `You are an expert AI agricultural assistant. Your task is to generate a comprehensive, personalized advisory for a farmer.

  **CRITICAL INSTRUCTION:** You MUST generate all advisory text *ENTIRELY* in the user's specified language: **{{{preferredLanguage}}}**. Do not use English unless the language is 'English'.

  **FARMER'S PROFILE:**
  - **Location:** {{{farmLocation}}}
  - **Main Crops:** {{{crops}}}
  - **Soil Type:** {{{soilType}}}

  **GENERATE THE FOLLOWING ADVISORIES:**

  1.  **Weather Advisory:**
      - Provide a realistic, detailed 7-day weather forecast table for the farmer's location.
      - Include columns for Day, Date, Min/Max Temp (°C), Humidity (%), and Chance of Rain (%).
      - After the table, give actionable advice based on the forecast. For example, if rain is coming, suggest holding off on irrigation. If it's very hot, suggest checking for heat stress.

  2.  **Soil Condition Advisory:**
      - Based on the soil type '{{{soilType}}}' and crops '{{{crops}}}', provide advice on maintaining soil health.
      - Mention the ideal pH range for the crops.
      - Suggest required NPK (Nitrogen, Phosphorus, Potassium) ratios.
      - Recommend specific organic amendments (like compost, manure, or neem cake) to improve soil structure and fertility.

  3.  **Market Price Advisory:**
      - Provide a realistic estimate of current market prices for the farmer's crops ({{{crops}}}) in their region ({{{farmLocation}}}).
      - Format this as "Crop Name: ₹X,XXX - ₹Y,YYY per quintal".
      - Provide a brief market outlook (e.g., "Prices are expected to rise in the next two weeks due to festival demand.").

  4.  **Disease Risk Advisory:**
      - Analyze the weather forecast you generated.
      - Identify potential disease or pest risks for the crops ({{{crops}}}) that are common in such weather (e.g., high humidity might increase fungal risk).
      - If a risk is identified, clearly state the risk and provide simple, actionable preventative steps (e.g., "High humidity increases the risk of Powdery Mildew in your crops. Ensure good air circulation by pruning lower leaves and consider a preventative spray of neem oil."). If no major risks, state that conditions are generally favorable.
  `,
});

const personalizedAdvisoryDashboardFlow = ai.defineFlow(
  {
    name: 'personalizedAdvisoryDashboardFlow',
    inputSchema: PersonalizedAdvisoryDashboardInputSchema,
    outputSchema: PersonalizedAdvisoryDashboardOutputSchema,
  },
  async (input, streamingCallback, context) => {
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
    throw new Error("Advisory dashboard failed after multiple retries.");
  }
);
