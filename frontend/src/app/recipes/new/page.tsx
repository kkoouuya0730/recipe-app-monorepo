"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { ErrorDialog } from "@/components/Dialog/ErrorDialog/ErrorDialog";

export default function NewRecipePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagName, setTagName] = useState("");
  const [tagNameError, setTagNameError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleAddTagButton = () => {
    setTagNameError(null);
    if (tagName === "") return;
    const isExist = tags.includes(tagName);

    if (isExist) {
      setTagNameError(`${tagName}はすでに入力されています`);
      setTagName("");
      return;
    }

    setTags([...tags, tagName]);
    setTagName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          tags: tags.map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "投稿に失敗しました");
      }

      const recipe = await res.json();
      router.push(`/recipes/${recipe.id}`);
    } catch (error: any) {
      setErrorMessage("レシピ作成に失敗しました");
    }
  };

  return (
    <div className="py-5">
      <h1 className="text-center text-[#A20065] text-2xl font-bold mb-1">新しいレシピを投稿</h1>
      <p className="mb-4 text-center text-sm">あなたの素敵なレシピをコミュニティと共有しましょう</p>

      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow bg-white p-2">
          <p className="text-[#A20065] text-xl font-bold mb-1">レシピ画像</p>
          <p className="text-xs mb-4">美味しそうな写真をアップロードしてください</p>

          <div className="border border-dashed p-1 rounded-md text-center">
            <p className="text-xs">画像をドラッグ&ドロップまたはクリックして選択</p>
            <button>画像を選択</button>
          </div>
        </div>

        <div className="rounded-md shadow bg-white p-2 grid gap-4">
          <p className="text-[#A20065] text-xl font-bold mb-1">基本情報</p>

          <div>
            <label htmlFor="name" className="text-xs block">
              レシピ名
            </label>
            <input
              id="name"
              name="name"
              placeholder="例：ふわふわオムライス"
              className="border block w-full rounded-md p-1 border-rose-200"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="description" className="text-xs block">
              レシピの説明
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="このレシピの特徴を教えてください"
              className="border block w-full rounded-md p-1 border-rose-200"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="cooking-time" className="text-xs block">
              調理時間
            </label>
            <select
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              id="cooking-time"
              name="cooking-time"
              className="border border-rose-200 rounded-md"
            >
              <option value="">--選択してください--</option>
              <option value="15min">15分</option>
              <option value="30min">30分</option>
              <option value="1hour">60分</option>
              <option value="2hour">90分</option>
            </select>
          </div>

          <div>
            <label htmlFor="servings" className="text-xs block">
              人数
            </label>
            <select
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              id="servings"
              name="servings"
              className="border border-rose-200 rounded-md"
            >
              <option value="">--選択してください--</option>
              <option value="1">1人分</option>
              <option value="2">2人分</option>
              <option value="3-4">3~4人分</option>
              <option value="5-6">5~6人分</option>
            </select>
          </div>

          <div>
            <label htmlFor="difficulty" className="text-xs block">
              難易度
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              id="difficulty"
              name="difficulty"
              className="border border-rose-200 rounded-md"
            >
              <option value="">--選択してください--</option>
              <option value="easy">簡単</option>
              <option value="medium">普通</option>
              <option value="hard-4">難しい</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="text-xs block">
              カテゴリ
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              id="category"
              name="category"
              className="border border-rose-200 rounded-md"
            >
              <option value="">--選択してください--</option>
              <option value="main">メイン</option>
              <option value="side">副菜</option>
              <option value="soup">汁物</option>
              <option value="dessert">デザート</option>
              <option value="snack">おやつ</option>
              <option value="drink">ドリンク</option>
            </select>
          </div>
        </div>

        {/* <div className="rounded-md shadow bg-white p-2">
          <p className="text-[#A20065] text-xl font-bold mb-1">材料</p>
          <p className="text-xs mb-4">美味しそうな写真をアップロードしてください</p>

          <div className="border border-dashed p-1 rounded-md text-center">
            <p className="text-xs">画像をドラッグ&ドロップまたはクリックして--選択してください--</p>
            <button>画像を選択</button>
          </div>
        </div>

        <div className="rounded-md shadow bg-white p-2">
          <p className="text-[#A20065] text-xl font-bold mb-1">作り方</p>
          <p className="text-xs mb-4">美味しそうな写真をアップロードしてください</p>

          <div className="border border-dashed p-1 rounded-md text-center">
            <p className="text-xs">画像をドラッグ&ドロップまたはクリックして選択</p>
            <button>画像を選択</button>
          </div>
        </div> */}

        <div className="rounded-md shadow bg-white p-2">
          <p className="text-[#A20065] text-xl font-bold mb-1" id="tag-label">
            タグ
          </p>
          <p className="text-xs mb-4" id="tag-description">
            レシピを見つけやすくするためのタグを追加してください
          </p>

          <div className="flex gap-2 mb-3">
            <input
              className="flex-1 border rounded-md border-rose-200"
              aria-labelledby="tag-label"
              aria-describedby="tag-description"
              placeholder="タグを入力"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
            />
            <button
              type="button"
              aria-label="タグを追加"
              className="border rounded-md border-rose-200 p-1"
              onClick={handleAddTagButton}
            >
              追加
            </button>
          </div>

          {tagNameError && <p className="mb-3 text-red-400">{tagNameError}</p>}

          <div>
            <ul className="flex gap-1">
              {tags.map((tag) => (
                <li key={tag}>
                  <div className="rounded-md bg-rose-100 p-1 w-fit text-xs">{tag}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button type="submit" className="bg-rose-600 p-3 w-fit mx-auto text-white rounded-lg">
          レシピを投稿する
        </button>
      </form>

      <ErrorDialog message={errorMessage} onClick={() => setErrorMessage(null)}>
        閉じる
      </ErrorDialog>
    </div>
  );
}
