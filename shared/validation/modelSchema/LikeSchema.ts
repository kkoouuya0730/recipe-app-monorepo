import { z } from 'zod';

/////////////////////////////////////////
// LIKE SCHEMA
/////////////////////////////////////////

export const LikeSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  recipeId: z.number().int(),
  createdAt: z.coerce.date(),
})

export type Like = z.infer<typeof LikeSchema>

export default LikeSchema;
