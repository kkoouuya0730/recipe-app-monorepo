import { z } from "zod";
import { UserSchema } from "shared/validation/modelSchema/UserSchema";

export const registerUserInput = UserSchema.pick({
  email: true,
  password: true,
  name: true,
});
export type RegisterUserInput = z.infer<typeof registerUserInput>;
export const loginUserInput = z.object({ email: z.email(), password: z.string().min(6) });
export type LoginUserInput = z.infer<typeof loginUserInput>;
