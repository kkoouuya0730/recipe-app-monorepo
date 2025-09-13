"use client";

import { useUserStore } from "@/lib/store/user";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

export default function ProfilePage() {
  const { isLoading, error } = useUserStore();

  const user = useRequireAuth();

  if (!user || isLoading) return <p>読み込み中...</p>;
  if (error) return <p>ユーザー情報の取得に失敗しました</p>;

  return (
    <>
      <div className="py-5">
        <div className="rounded-md bg-white mb-8 shadow grid gap-2 p-2">
          <div>
            <p className="font-bold">{user.name}</p>
            <p className="text-xs">@kkoouuya</p>
          </div>
          <p>{user.biography}</p>
          <div className="flex gap-1 text-xs">
            <p>東京,日本</p>
            <p>2023年3月に参加</p>
          </div>
          <div className="flex gap-1 text-xs">
            <p>567フォロー</p>
            <p>567フォロワー</p>
            <p>567レシピ</p>
          </div>
        </div>

        <div className="rounded-md bg-white shadow grid gap-2 p-2">
          <p className="font-bold">
            投稿したレシピ<span className="text-xs">（4件）</span>
          </p>

          <ul className="grid gap-2">
            <li>
              <div className="rounded-md shadow p-2">
                <p className="font-bold">ふわふわオムレツ</p>
                <p>卵がとろとろで美味しい定番オムライスのレシピです。家族みんなが大好きな一品！</p>
                <div className="text-xs flex gap-1">
                  <p>20分</p>
                  <p>2人分</p>
                </div>
                <div className="text-xs flex gap-1">
                  <p className="text-red-500">156件のいいね</p>
                  <p>23件のコメント</p>
                </div>
              </div>
            </li>
            <li>
              <div className="rounded-md shadow p-2">
                <p className="font-bold">ふわふわオムレツ</p>
                <p>卵がとろとろで美味しい定番オムライスのレシピです。家族みんなが大好きな一品！</p>
                <div className="text-xs flex gap-1">
                  <p>20分</p>
                  <p>2人分</p>
                </div>
                <div className="text-xs flex gap-1">
                  <p className="text-red-500">156件のいいね</p>
                  <p>23件のコメント</p>
                </div>
              </div>
            </li>
            <li>
              <div className="rounded-md shadow p-2">
                <p className="font-bold">ふわふわオムレツ</p>
                <p>卵がとろとろで美味しい定番オムライスのレシピです。家族みんなが大好きな一品！</p>
                <div className="text-xs flex gap-1">
                  <p>20分</p>
                  <p>2人分</p>
                </div>
                <div className="text-xs flex gap-1">
                  <p className="text-red-500">156件のいいね</p>
                  <p>23件のコメント</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
