import { z } from "zod";

/////////////////////////////////////////
// REFRESH TOKEN SCHEMA
/////////////////////////////////////////

export const RefreshTokenSchema = z.object({
  id: z.number().int(),
  token: z.string(),
  userId: z.number().int(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
});

export type RefreshToken = z.infer<typeof RefreshTokenSchema>;

export default RefreshTokenSchema;
