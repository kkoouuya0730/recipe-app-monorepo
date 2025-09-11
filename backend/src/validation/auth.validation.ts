import { z } from "zod";

export const registerUserInput = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(1),
});
export type RegisterUserInput = z.infer<typeof registerUserInput>;
export const loginUserInput = z.object({ email: z.email(), password: z.string().min(6) });
export type LoginUserInput = z.infer<typeof loginUserInput>;
