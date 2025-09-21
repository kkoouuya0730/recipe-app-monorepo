import { z } from 'zod';

/////////////////////////////////////////
// STEP SCHEMA
/////////////////////////////////////////

export const StepSchema = z.object({
  id: z.number().int(),
  order: z.number().int(),
  title: z.string(),
  content: z.string().nullable(),
  recipeId: z.number().int(),
})

export type Step = z.infer<typeof StepSchema>

export default StepSchema;
