import { z } from "zod";
import { RecipeSchema } from "shared/validation/modelSchema/RecipeSchema";

export const createRecipeInput = RecipeSchema.pick({
  title: true,
  description: true,
  // imageUrl: true,
  // cookTime: true,
  // servings: true,
  // category: true,
  // step: true,
  // ingredients: true,
  // likes: true,
}).extend({
  tags: z.array(z.object({ name: z.string() })),
});

export type CreateRecipeInput = z.infer<typeof createRecipeInput>;
