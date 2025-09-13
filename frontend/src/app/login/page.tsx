"use client";

import clsx from "clsx";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/lib/store/user";
import { useAuthStore } from "@/lib/store/auth";
import { useRedirectIfAuth } from "@/lib/hooks/useRedirectIfAuth";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const { setUser } = useUserStore();

  const router = useRouter();

  // ログイン済みならリダイレクト
  useRedirectIfAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const loginUser = await login({ email, password });
      setUser(loginUser);

      setLoading(false);
      router.push("/profile");
    } catch (err: any) {
      console.error(err);
      setError("ログインに失敗しました");
      setLoading(false);
    }
  };

  const isDisable = email.trim() === "" || password.trim() === "";

  return (
    <>
      <div className="py-5">
        <h1 className="text-center text-[#A20065] text-2xl font-bold">レシピコミュニティ</h1>
        <p className="mb-4 text-center text-sm">あなたの料理の旅を続けましょう</p>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="shadow rounded-md p-4 bg-pink-100">
          <h2 className="text-center text-[#A20065] text-xl font-bold">ログイン</h2>
          <p className="text-center text-xs mb-4">
            <span className="block">今すぐ参加して</span>素晴らしいレシピの世界を探索しましょう
          </p>

          <form onSubmit={onSubmit} className="grid gap-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-xs mb-1">
                メールアドレス
              </label>
              <input
                value={email}
                id="email"
                type="email"
                placeholder="example@email.com"
                className="bg-white rounded-md block w-full"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs mb-1">
                パスワード
              </label>
              <input
                value={password}
                id="password"
                type="password"
                placeholder="6文字以上のパスワード"
                className="bg-white rounded-md block w-full"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
              />
            </div>

            <button
              type="submit"
              className={clsx(["bg-[#A20065] text-white rounded-lg py-2 font-bold", isDisable && "bg-gray-300"])}
              disabled={loading || isDisable}
            >
              ログイン
            </button>
          </form>

          <p className="text-center text-xs">
            アカウントをお持ちでない方は
            <Link className="block cursor-pointer text-[#AE0076]" href="/signup">
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
