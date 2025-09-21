import { z } from 'zod';

/////////////////////////////////////////
// COMMENT SCHEMA
/////////////////////////////////////////

export const CommentSchema = z.object({
  id: z.number().int(),
  recipeId: z.number().int(),
  userId: z.number().int(),
  content: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Comment = z.infer<typeof CommentSchema>

export default CommentSchema;
