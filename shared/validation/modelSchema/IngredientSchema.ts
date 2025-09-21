import { z } from 'zod';

/////////////////////////////////////////
// INGREDIENT SCHEMA
/////////////////////////////////////////

export const IngredientSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  amount: z.number().nullable(),
  unit: z.string().nullable(),
  recipeId: z.number().int(),
})

export type Ingredient = z.infer<typeof IngredientSchema>

export default IngredientSchema;
