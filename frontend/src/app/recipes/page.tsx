"use client";

import { ErrorDialog } from "@/components/Dialog/ErrorDialog/ErrorDialog";
import UseIcon from "@/components/ui/icons/UseIcon";
import { api } from "@/lib/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Recipe } from "shared/validation/modelSchema/RecipeSchema";

export default function RecipesPage({}) {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/recipes`);
        setRecipes(res);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setErrorMessage("レシピの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (loading) {
    return <p>レシピ情報取得中</p>;
  }

  return (
    <div className="py-5">
      <h1 className="text-center text-[#A20065] text-2xl font-bold mb-4">レシピ一覧</h1>

      {/* TODO レシピ検索 */}

      <div className="">
        {recipes &&
          recipes.map((recipe) => (
            <article key={recipe.id} className="mb-4 p-3 bg-white rounded-md">
              <Image
                src="/fluffy-omurice-japanese-omelet-rice.jpg"
                alt={`${recipe.title}のヘッダー画像`}
                width={500}
                height={200}
                className="mb-4"
              />

              <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
              <p className="text-sm mb-2 text-black/60">{recipe.description}</p>

              <div className="flex gap-4 mb-2 text-sm text-black/60">
                <span className="flex items-center gap-1">
                  <UseIcon iconName="clock" />
                  {recipe.cookTime}分
                </span>
                <span className="flex items-center gap-1">
                  <UseIcon iconName="users" />
                  {recipe.servings}人分
                </span>
              </div>

              <div className="flex gap-4 text-sm text-black/60">
                <span className="flex items-center gap-1">
                  <UseIcon iconName="heart" />
                  {recipe.likes.length}
                </span>
                <span className="flex items-center gap-1">
                  <UseIcon iconName="comment" />
                  {recipe.comments.length}
                </span>
              </div>
            </article>
          ))}
      </div>

      <ErrorDialog message={errorMessage}>レシピ一覧に戻る</ErrorDialog>
    </div>
  );
}
