import { ErrorDialog } from "@/components/Dialog/ErrorDialog/ErrorDialog";
import UseIcon from "@/components/ui/icons/UseIcon";
import Image from "next/image";
import Link from "next/link";
import { Recipe } from "shared/validation/modelSchema/RecipeSchema";

export default async function RecipesPage({}) {
  let recipes: Recipe[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return (
        <div className="py-5">
          <ErrorDialog message="レシピの取得に失敗しました">レシピ一覧に戻る</ErrorDialog>
        </div>
      );
    }

    recipes = await res.json();
  } catch (error) {
    console.error(error);
    return (
      <div className="py-5">
        <ErrorDialog message="レシピの取得に失敗しました">レシピ一覧に戻る</ErrorDialog>
      </div>
    );
  }

  return (
    <div className="py-5">
      <h1 className="text-center text-[#A20065] text-2xl font-bold mb-4">レシピ一覧</h1>

      {/* TODO レシピ検索 */}

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        {recipes &&
          recipes.map((recipe) => (
            <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
              <article className="mb-4 p-3 bg-white rounded-md w-full max-w-[360px] mx-auto">
                <Image
                  src={recipe.imageUrl || "/fluffy-omurice-japanese-omelet-rice.jpg"}
                  alt={`${recipe.title}のヘッダー画像`}
                  width={500}
                  height={200}
                  className="mb-4"
                />

                <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
                <p className="text-sm mb-2 text-black/60 line-clamp-3">{recipe.description}</p>

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
            </Link>
          ))}
      </div>
    </div>
  );
}
