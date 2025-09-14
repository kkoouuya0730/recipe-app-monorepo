"use client";

import { useUserStore } from "@/lib/store/user";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

type Recipe = {
  id: number;
  title: string;
  description: string;
  comments?: { id: number }[];
};

export default function ProfilePage() {
  const { isLoading, error } = useUserStore();

  const user = useRequireAuth();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [recipeError, setRecipeError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchMyRecipes = async () => {
      try {
        const res = await api.get("/recipes/my-recipes");
        setRecipes(res.data);
      } catch (error) {
        setRecipeError("レシピの取得に失敗しました");
      } finally {
        setLoadingRecipes(false);
      }
    };

    fetchMyRecipes();
  }, [user]);

  if (!user || isLoading) return <p>読み込み中...</p>;
  if (error) return <p>ユーザー情報の取得に失敗しました</p>;

  return (
    <>
      <div className="py-5">
        <div className="rounded-md bg-white mb-8 shadow grid gap-2 p-2">
          <div>
            <p className="font-bold">{user.name}</p>
          </div>
          <p>{user.biography}</p>
        </div>

        <div className="rounded-md bg-white shadow grid gap-2 p-2">
          <p className="font-bold">
            投稿したレシピ<span className="text-xs">({recipes.length}件)</span>
          </p>

          {loadingRecipes ? (
            <p>レシピを読み込み中...</p>
          ) : recipeError ? (
            <p className="text-red-500">{recipeError}</p>
          ) : recipes.length === 0 ? (
            <p>投稿したレシピはまだありません</p>
          ) : (
            <ul className="grid gap-2">
              {recipes.map((recipe) => (
                <li key={recipe.id}>
                  <Link href={`/recipes/${recipe.id}`}>
                    <div className="rounded-md shadow p-2">
                      <p className="font-bold">{recipe.title}</p>
                      <p>{recipe.description}</p>

                      <div className="text-xs flex gap-1">
                        <p>{recipe.comments?.length}件のコメント</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
