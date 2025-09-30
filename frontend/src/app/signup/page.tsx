"use client";

import { api } from "../../lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormValues, signUpSchema } from "@/validation/loginSchema";
import { isDefined, isNonEmptyString } from "@/util/isDefinedValue";
import Link from "next/link";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
export default function SignUpPage() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur", // blur時にバリデーション
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      setLoading(true);

      const isPasswordMatched = password === passwordConfirm;
      if (!isPasswordMatched) {
        setLoading(false);
        return;
      }

      await api.post("/auth/signup", data);

      setLoading(false);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const name = watch("name") || "";
  const email = watch("email") || "";
  const password = watch("password") || "";
  const passwordConfirm = watch("passwordConfirm") || "";

  const hasAnyError = Object.values(errors).some(isDefined);
  const isDisable =
    !isNonEmptyString(name) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(password) ||
    !isNonEmptyString(passwordConfirm) ||
    hasAnyError;

  return (
    <div className="py-5">
      <h1 className="text-center text-[#A20065] text-2xl font-bold">
        <span className="block">レシピコミュニティへ</span>
        ようこそ！
      </h1>
      <p className="mb-4 text-center text-sm">
        <span className="block ">美味しいレシピを共有し</span>
        新しい料理を発見しましょう
      </p>

      <div className="shadow rounded-md p-4 bg-pink-100">
        <h2 className="text-center text-[#A20065] text-xl font-bold">アカウント作成</h2>
        <p className="text-center text-xs mb-4">
          <span className="block">今すぐ参加して</span>素晴らしいレシピの世界を探索しましょう
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mb-6" noValidate>
          <Input
            label="お名前"
            type="text"
            value={watch("name") || ""}
            iconName="user"
            {...register("name")}
            onClear={() => setValue("name", "")}
            placeholder="お名前を入力してください"
            errorMessage={errors.name?.message}
            required
          />

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
          <Input
            label="パスワード確認"
            type="password"
            value={watch("passwordConfirm") || ""}
            iconName="lock"
            {...register("passwordConfirm")}
            onClear={() => setValue("passwordConfirm", "")}
            placeholder="6文字以上のパスワード"
            errorMessage={errors.passwordConfirm?.message}
            required
          />

          <Button type="submit" disabled={loading || isDisable}>
            アカウントを作成する
          </Button>
        </form>

        <p className="text-center text-xs">
          アカウントをお持ちの方は
          <Link className="block cursor-pointer w-fit mx-auto text-[#AE0076]" href="/login">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
