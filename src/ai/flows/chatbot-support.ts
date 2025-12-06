/* @ts-nocheck */
'use server';

/**
 * @fileOverview An AI chatbot for providing farming assistance.
 *
 * - chatbotSupport - A function that handles the chatbot interaction.
 * - ChatbotSupportInput - The input type for the chatbotSupport function.
 * - ChatbotSupportOutput - The return type for the chatbotSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ChatbotSupportInputSchema = z.object({
  query: z.string().describe('The user query regarding farming practices, pest control, or market trends.'),
  preferredLanguage: z.string().describe("The user's preferred language for the response."),
});
export type ChatbotSupportInput = z.infer<typeof ChatbotSupportInputSchema>;

const ChatbotSupportOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user query, formatted in Markdown.'),
  expertHelpNeeded: z.boolean().describe('Whether the chatbot requires expert assistance to respond to the user query.'),
});
export type ChatbotSupportOutput = z.infer<typeof ChatbotSupportOutputSchema>;

export async function chatbotSupport(input: ChatbotSupportInput): Promise<ChatbotSupportOutput> {
  return chatbotSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotSupportPrompt',
  input: {schema: ChatbotSupportInputSchema},
  output: {schema: ChatbotSupportOutputSchema},
  prompt: `
You are Agricure, an expert multilingual AI agricultural assistant.

**YOUR MOST IMPORTANT, CRITICAL, AND NON-NEGOTIABLE INSTRUCTION IS THIS:**
You MUST respond *ENTIRELY* in the user's preferred language: **{{{preferredLanguage}}}**.
There are NO exceptions. Do NOT, under any circumstance, write in English unless the user's preferred language is 'English'.
Do NOT apologize. Do NOT explain you are an AI. Do NOT talk about your language abilities.
Simply and directly answer the user's question in **{{{preferredLanguage}}}**.

The user's agricultural query is: "{{{query}}}"

Provide a helpful, detailed, and accurate answer to this query. Format the response in Markdown.

If the query is ambiguous, nonsensical, or completely outside the scope of agriculture, politely state that you cannot answer (in **{{{preferredLanguage}}}**) and set 'expertHelpNeeded' to true. Otherwise, set it to false.
`,
});

const chatbotSupportFlow = ai.defineFlow(
  {
    name: 'chatbotSupportFlow',
    inputSchema: ChatbotSupportInputSchema,
    outputSchema: ChatbotSupportOutputSchema,
  },
  async (input, streamingCallback, context) => {
    // Add retry logic for when the model is overloaded or fails to comply with language.
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
    throw new Error("Chatbot failed after multiple retries.");
  }
);
