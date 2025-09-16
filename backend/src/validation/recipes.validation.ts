import { z } from "zod";

export const createRecipeInput = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string().min(1)).optional(),
});

export type CreateRecipeInput = z.infer<typeof createRecipeInput>;
