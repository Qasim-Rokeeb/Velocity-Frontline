// src/ai/flows/dynamic-difficulty.ts
'use server';

/**
 * @fileOverview Adjusts the game difficulty dynamically based on player performance.
 *
 * - adjustDifficulty - A function to determine new difficulty settings.
 * - AdjustDifficultyInput - The input type for adjustDifficulty function.
 * - AdjustDifficultyOutput - The return type for adjustDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustDifficultyInputSchema = z.object({
  averageLapTime: z
    .number()
    .describe('The player\'s average lap time in seconds.'),
  numCompletedLaps: z
    .number()
    .describe('The number of laps the player has completed.'),
  numCollisions: z
    .number()
    .describe('The number of collisions the player has had.'),
});
export type AdjustDifficultyInput = z.infer<typeof AdjustDifficultyInputSchema>;

const AdjustDifficultyOutputSchema = z.object({
  opponentSpeedMultiplier: z
    .number()
    .describe(
      'A multiplier to adjust the speed of the AI opponents; higher values mean faster opponents.'
    ),
  opponentAggressionFactor: z
    .number()
    .describe(
      'A factor to adjust how aggressively the AI opponents drive; higher values mean more aggressive opponents.'
    ),
});
export type AdjustDifficultyOutput = z.infer<typeof AdjustDifficultyOutputSchema>;

export async function adjustDifficulty(input: AdjustDifficultyInput): Promise<AdjustDifficultyOutput> {
  return adjustDifficultyFlow(input);
}

const adjustDifficultyPrompt = ai.definePrompt({
  name: 'adjustDifficultyPrompt',
  input: {schema: AdjustDifficultyInputSchema},
  output: {schema: AdjustDifficultyOutputSchema},
  prompt: `You are an expert game AI tuning specialist.

You will receive data about the player's performance in a racing game. Based on this data, you will determine how to adjust the difficulty of the AI opponents to keep the game challenging and engaging.

Specifically, you will determine two factors:

- opponentSpeedMultiplier: A multiplier to adjust the speed of the AI opponents. Higher values mean faster opponents.
- opponentAggressionFactor: A factor to adjust how aggressively the AI opponents drive. Higher values mean more aggressive opponents.

Here is the player's performance data:

Average Lap Time: {{{averageLapTime}}} seconds
Number of Completed Laps: {{{numCompletedLaps}}}
Number of Collisions: {{{numCollisions}}}

Based on this data, how should the AI opponent difficulty be adjusted?

Consider these factors:

- If the average lap time is low and the number of collisions is low, the player is performing well and the difficulty should be increased.
- If the average lap time is high and the number of collisions is high, the player is struggling and the difficulty should be decreased.
- If the number of completed laps is high, the player is experienced and the difficulty should be gradually increased.

Output a JSON object with the opponentSpeedMultiplier and opponentAggressionFactor.`,
});

const adjustDifficultyFlow = ai.defineFlow(
  {
    name: 'adjustDifficultyFlow',
    inputSchema: AdjustDifficultyInputSchema,
    outputSchema: AdjustDifficultyOutputSchema,
  },
  async input => {
    const {output} = await adjustDifficultyPrompt(input);
    return output!;
  }
);
