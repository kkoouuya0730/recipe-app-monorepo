"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/lib/store/user";
import { useAuthStore } from "@/lib/store/auth";
import { useRedirectIfAuth } from "@/lib/hooks/useRedirectIfAuth";
import { useForm } from "react-hook-form";
import { LoginFormValues, loginSchema } from "@/validation/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { isDefined, isNonEmptyString } from "@/util/isDefinedValue";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import { ErrorDialog } from "@/components/Dialog/ErrorDialog/ErrorDialog";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login } = useAuthStore();
  const { setUser } = useUserStore();

  const router = useRouter();

  // ログイン済みならリダイレクト
  useRedirectIfAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", // blur時にバリデーション
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);

      const loginUser = await login(data);
      setUser(loginUser);

      setLoading(false);
      router.push("/profile");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (err: any) {
      setErrorMessage("ログインに失敗しました");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const email = watch("email") || "";
  const password = watch("password") || "";

  const hasAnyError = Object.values(errors).some(isDefined);
  const isDisable = !isNonEmptyString(email) || !isNonEmptyString(password) || hasAnyError;

  return (
    <div className="py-5">
      <h1 className="text-center text-[#A20065] text-2xl font-bold">レシピコミュニティ</h1>
      <p className="mb-4 text-center text-sm">あなたの料理の旅を続けましょう</p>

      <section className="shadow rounded-md p-4 bg-pink-100">
        <h2 className="text-center text-[#A20065] text-xl font-bold">ログイン</h2>
        <p className="text-center text-xs mb-4">
          <span className="block">今すぐ参加して</span>素晴らしいレシピの世界を探索しましょう
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mb-6" noValidate>
          <Input
            label="メールアドレス"
            type="email"
            value={watch("email") || ""}
            iconName="email"
            {...register("email")}
            onClear={() => setValue("email", "")}
            placeholder="example@mail.com"
            errorMessage={errors.email?.message}
            required
          />

          <Input
            label="パスワード"
            type="password"
            value={watch("password") || ""}
            iconName="lock"
            {...register("password")}
            onClear={() => setValue("password", "")}
            placeholder="6文字以上のパスワード"
            errorMessage={errors.password?.message}
            required
          />

          <Button type="submit" disabled={loading || isDisable}>
            ログイン
          </Button>
        </form>

        <p className="text-center text-xs">
          アカウントをお持ちでない方は
          <Link className="block cursor-pointer w-fit mx-auto text-[#AE0076]" href="/signup">
            新規登録
          </Link>
        </p>
      </section>

      <ErrorDialog message={errorMessage} onClick={() => setErrorMessage(null)}>
        閉じる
      </ErrorDialog>
    </div>
  );
}
