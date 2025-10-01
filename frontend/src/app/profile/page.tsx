"use client";

import { useUserStore } from "@/lib/store/user";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import type { Recipe } from "shared/validation/modelSchema/RecipeSchema";
import { ErrorDialog } from "@/components/Dialog/ErrorDialog/ErrorDialog";

export default function ProfilePage() {
  const { isLoading, error } = useUserStore();

  const user = useRequireAuth();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchMyRecipes = async () => {
      setLoadingRecipes(true);
      try {
        const res = await api.get("/recipes/my-recipes");
        setRecipes(res);
      } catch (error) {
        setErrorMessage("レシピの取得に失敗しました");
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchMyRecipes();
  }, [user]);

  if (!user || isLoading) return <p>読み込み中...</p>;
  if (error) return <p>ユーザー情報の取得に失敗しました</p>;

  return (
    <div className="py-5">
      <section className="rounded-md bg-white mb-8 shadow grid gap-2 p-2">
        <h2 className="font-bold">{user.name}</h2>
        <p>{user.biography}</p>
      </section>

      <section className="rounded-md bg-white shadow grid gap-2 p-2">
        <h2 className="font-bold">
          投稿したレシピ<span className="text-xs">({recipes.length}件)</span>
        </h2>

        {loadingRecipes ? (
          <p>レシピを読み込み中...</p>
        ) : recipes.length === 0 ? (
          <p>投稿したレシピはまだありません</p>
        ) : (
          <ul className="grid gap-2">
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <Link href={`/recipes/${recipe.id}`}>
                  <article className="rounded-md shadow p-2">
                    <h3 className="font-bold">{recipe.title}</h3>
                    <p>{recipe.description}</p>

                    <div className="text-xs flex gap-1">
                      <p>{recipe.comments?.length}件のコメント</p>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ErrorDialog message={errorMessage} onClick={() => setErrorMessage(null)}>
        閉じる
      </ErrorDialog>
    </div>
  );
}
