import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("有効なメールアドレスを入力してください").nonempty("メールアドレスは必須です"),
  password: z.string().nonempty("パスワードは必須です").min(6, "パスワードは6文字以上で入力してください"),
});

//LoginFormValues 型を Zod から生成
export type LoginFormValues = z.infer<typeof loginSchema>;
