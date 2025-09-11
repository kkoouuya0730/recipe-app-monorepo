import { z } from "zod";

export const createRecipeInput = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  userId: z.number(),
});

export type CreateRecipeInput = z.infer<typeof createRecipeInput>;
