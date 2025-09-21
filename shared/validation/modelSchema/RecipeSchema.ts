import { z } from "zod";
import CommentSchema from "./CommentSchema";
import { TagSchema } from "./TagSchema";
import StepSchema from "./StepSchema";
import IngredientSchema from "./IngredientSchema";
import LikeSchema from "./LikeSchema";

/////////////////////////////////////////
// RECIPE SCHEMA
/////////////////////////////////////////
export const DifficultySchema = z.enum(["easy", "medium", "hard"]);
export const RecipeSchema = z.object({
  difficulty: DifficultySchema.nullable(),
  id: z.number().int(),
  userId: z.number().int(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().nullable(),
  cookTime: z.number().int().nullable(),
  servings: z.number().int().nullable(),
  category: z.string().nullable(),
  comments: z.array(CommentSchema),
  tags: z.array(TagSchema),
  steps: z.array(StepSchema),
  ingredients: z.array(IngredientSchema),
  likes: z.array(LikeSchema),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Recipe = z.infer<typeof RecipeSchema>;
