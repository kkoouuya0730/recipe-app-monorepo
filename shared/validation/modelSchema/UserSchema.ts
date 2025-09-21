import { z } from "zod";
import CommentSchema from "./CommentSchema";
import LikeSchema from "./LikeSchema";
import RefreshTokenSchema from "./RefreshTokenSchema";
import { RecipeSchema } from "./RecipeSchema";

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.number().int(),
  email: z.string(),
  password: z.string().min(6),
  name: z.string().min(1),
  avatarUrl: z.string().nullable(),
  headerUrl: z.string().nullable(),
  biography: z.string().nullable(),
  recipes: z.array(RecipeSchema),
  comments: z.array(CommentSchema),
  RefreshToken: z.array(RefreshTokenSchema),
  Like: z.array(LikeSchema),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type User = z.infer<typeof UserSchema>;
