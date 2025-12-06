'use server';

/**
 * @fileOverview Provides voice-assisted navigation within the Agricure app.
 *
 * - navigateWithVoice - A function that takes a voice command and returns the appropriate navigation action.
 * - NavigateWithVoiceInput - The input type for the navigateWithVoice function.
 * - NavigateWithVoiceOutput - The return type for the navigateWithVoice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NavigateWithVoiceInputSchema = z.object({
  voiceCommand: z.string().describe('The voice command from the user.'),
});
export type NavigateWithVoiceInput = z.infer<typeof NavigateWithVoiceInputSchema>;

const NavigateWithVoiceOutputSchema = z.object({
  action: z.string().describe('The navigation action to perform (e.g., open advisory dashboard, open marketplace).'),
  details: z.string().optional().describe('Any additional details needed for the action (e.g., product ID, category).'),
});
export type NavigateWithVoiceOutput = z.infer<typeof NavigateWithVoiceOutputSchema>;

export async function navigateWithVoice(input: NavigateWithVoiceInput): Promise<NavigateWithVoiceOutput> {
  return navigateWithVoiceFlow(input);
}

const navigateWithVoicePrompt = ai.definePrompt({
  name: 'navigateWithVoicePrompt',
  input: {schema: NavigateWithVoiceInputSchema},
  output: {schema: NavigateWithVoiceOutputSchema},
  prompt: `You are a voice assistant for the Agricure app, designed to help farmers navigate the app using voice commands.

  The user will provide a voice command, and you should determine the appropriate navigation action and any necessary details.

  Here are the possible actions:
  - open advisory dashboard
  - open marketplace
  - open product details
  - open soil test booking
  - open disease scanning
  - open equipment marketplace

  Voice Command: {{{voiceCommand}}}

  Consider these examples:
  User: "Open the advisory dashboard"
  Action: open advisory dashboard

  User: "Take me to the marketplace"
  Action: open marketplace

  User: "Show me product details for fertilizer X"
  Action: open product details
  Details: fertilizer X

  User: "Book a soil test"
  Action: open soil test booking

  User: "Detect disease in my crop"
  Action: open disease scanning

  User: "Show me tractors in the equipment marketplace"
  Action: open equipment marketplace
  Details: tractors
  `, // Updated prompt for clarity and examples
});

const navigateWithVoiceFlow = ai.defineFlow(
  {
    name: 'navigateWithVoiceFlow',
    inputSchema: NavigateWithVoiceInputSchema,
    outputSchema: NavigateWithVoiceOutputSchema,
  },
  async input => {
    const {output} = await navigateWithVoicePrompt(input);
    return output!;
  }
);
