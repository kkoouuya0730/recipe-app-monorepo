import { z } from "zod";
import { RecipeSchema } from "shared/validation/modelSchema/RecipeSchema";

export const createRecipeInput = RecipeSchema.pick({
  title: true,
  description: true,
  tags: true,
});

export type CreateRecipeInput = z.infer<typeof createRecipeInput>;
