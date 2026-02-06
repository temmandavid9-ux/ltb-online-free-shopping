'use server';

/**
 * @fileOverview Provides personalized product recommendations based on user browsing history and purchase behavior.
 *
 * - getPersonalizedRecommendations - A function that generates personalized product recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  browsingHistory: z.array(z.string()).describe('List of product IDs representing the user browsing history.'),
  purchaseHistory: z.array(z.string()).describe('List of product IDs representing the user purchase history.'),
  userId: z.string().describe('The unique identifier of the user.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendedProducts: z.array(z.object({
    productId: z.string().describe('The ID of the recommended product.'),
    reason: z.string().describe('The reason why the product is recommended for the user.'),
  })).describe('A list of recommended products with reasons.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an expert e-commerce recommendation engine.

  Given the user's browsing history: {{{browsingHistory}}}
  And their purchase history: {{{purchaseHistory}}}
  Generate a list of recommended products (with productId and reason) that the user might be interested in.
  The user ID is: {{{userId}}}.
  Ensure that you only suggest existing products and provide a clear justification for each recommendation based on their past behavior.
  Do not recommend items that the user has already purchased.
  Do not repeat product recommendations.
`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
