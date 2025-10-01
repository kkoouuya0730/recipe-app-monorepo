"use client";

import { ReactNode, use, useEffect, useState } from "react";

import { api } from "@/lib/api";
import Image from "next/image";
import type { Recipe } from "shared/validation/modelSchema/RecipeSchema";
import type { User } from "shared/validation/modelSchema/UserSchema";
import { ErrorDialog } from "@/components/Dialog/ErrorDialog/ErrorDialog";
import { useRouter } from "next/router";

type SectionContainerProps = {
  children: ReactNode;
};

const SectionContainer = ({ children }: SectionContainerProps) => {
  return <div className="rounded-md bg-white pb-4">{children}</div>;
};

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: recipeId } = use(params);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      setLoadingRecipe(true);
      try {
        const res = await api.get(`/recipes/${recipeId}`);
        setRecipe(res);
        setUser(res.user);
      } catch (error) {
        setErrorMessage("レシピの取得に失敗しました");
      } finally {
        setLoadingRecipe(false);
      }
    };
    fetchRecipeDetail();
  }, [recipeId]);

  if (loadingRecipe) {
    return <p>レシピ情報取得中</p>;
  }

  return (
    <div className="py-5 grid gap-4">
      <SectionContainer>
        <Image
          src="/fluffy-omurice-japanese-omelet-rice.jpg"
          alt="ふわふわオムライス"
          width={800}
          height={384}
          className="w-full h-96 object-cover rounded-t-md mb-4"
        />

        <div className="flex items-center gap-3 px-3 mb-3">
          <Image
            src={user?.avatarUrl ?? "/IMG_0522.png"}
            alt={`${user?.name}のプロフィール画像`}
            width={800}
            height={384}
            className="h-12 w-12 rounded-full border border-black"
          />
          <p className="flex-1 ">{user?.name}</p>
          <button type="button" className="p-2 bg-black text-white rounded-md">
            フォロー
          </button>
        </div>

        <div className="px-3">
          <h1 className="text-[#A20065] text-2xl font-bold mb-1">{recipe?.title}</h1>
          <p className="text-sm mb-2">{recipe?.description}</p>
          <p className="flex gap-2 mb-1 text-sm">
            <span>調理時間</span>
            <span>2人分</span>
            <span>難易度：中級</span>
          </p>

          <ul className="flex gap-1">
            <li className="rounded-md bg-rose-100 p-1 w-fit text-xs">和食</li>
            <li className="rounded-md bg-rose-100 p-1 w-fit text-xs">和食</li>
            <li className="rounded-md bg-rose-100 p-1 w-fit text-xs">和食</li>
            <li className="rounded-md bg-rose-100 p-1 w-fit text-xs">和食</li>
          </ul>
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="p-3">
          <h2 className="text-2xl font-bold">コメント({`${recipe?.comments?.length ?? 0}`}件)</h2>
          <ul className="grid gap-1">
            {recipe?.comments?.map((comment) => (
              <li key={comment.id} className="text-xs">
                {comment.content}
              </li>
            ))}
          </ul>
        </div>
      </SectionContainer>

      <ErrorDialog message={errorMessage} onClick={() => router.push("/recipes")}>
        レシピ一覧に戻る
      </ErrorDialog>
    </div>
  );
}
