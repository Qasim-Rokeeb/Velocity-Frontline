// src/lib/actions.ts
'use server';

import { adjustDifficulty, AdjustDifficultyInput, AdjustDifficultyOutput } from '@/ai/flows/dynamic-difficulty';

interface ActionResult {
    success: boolean;
    data?: AdjustDifficultyOutput;
    error?: string;
}

export async function getDifficultyAdjustment(input: AdjustDifficultyInput): Promise<ActionResult> {
  // Basic validation
  if (input.numCompletedLaps < 0 || input.averageLapTime < 0 || input.numCollisions < 0) {
    return { success: false, error: 'Invalid input values. Please use positive numbers.' };
  }

  try {
    const result = await adjustDifficulty(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getDifficultyAdjustment:', error);
    return { success: false, error: 'An unexpected error occurred while analyzing performance.' };
  }
}
