"use client";

import clsx from "clsx";
import { api } from "../../lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const isPasswordMatched = password === passwordConfirm;
      if (!isPasswordMatched) {
        setError("パスワードが一致しません");
        setLoading(false);
        return;
      }

      await api.post("/auth/signup", { name, email, password });

      setLoading(false);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError("登録に失敗しました");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const isDisable =
    name.trim() === "" || email.trim() === "" || password.trim() === "" || passwordConfirm.trim() === "";

  return (
    <>
      <div className="py-5">
        <h1 className="text-center text-[#A20065] text-2xl font-bold">
          <span className="block">レシピコミュニティへ</span>
          ようこそ！
        </h1>
        <p className="mb-4 text-center text-sm">
          <span className="block ">美味しいレシピを共有し</span>
          新しい料理を発見しましょう
        </p>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="shadow rounded-md p-4 bg-pink-100">
          <h2 className="text-center text-[#A20065] text-xl font-bold">アカウント作成</h2>
          <p className="text-center text-xs mb-4">
            <span className="block">今すぐ参加して</span>素晴らしいレシピの世界を探索しましょう
          </p>

          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="">
              <label htmlFor="name" className="block text-xs mb-1">
                お名前
              </label>
              <input
                value={name}
                id="name"
                className="bg-white rounded-md block w-full"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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

            <div>
              <label htmlFor="passwordConfirm" className="block text-xs mb-1">
                パスワード確認
              </label>
              <input
                value={passwordConfirm}
                id="passwordConfirm"
                type="password"
                placeholder="パスワードを再入力"
                className="bg-white rounded-md block w-full"
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={clsx(["bg-[#A20065] text-white rounded-lg py-2 font-bold", isDisable && "bg-gray-300"])}
              disabled={loading || isDisable}
            >
              アカウントを作成する
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
