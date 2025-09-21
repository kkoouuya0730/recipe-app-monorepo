import { Router } from "express";
import { prisma } from "../prismaClient";
import { createRecipeInput } from "../validation/recipes.validation";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import z from "zod";
import { InvalidInputError, NotFoundError } from "../errors/AppError";
import { RecipeSchema } from "shared/validation/modelSchema/RecipeSchema";

const router = Router();

const idSchema = RecipeSchema.pick({
  id: true,
});

// レシピ作成
router.post("/", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const recipeContentResult = createRecipeInput.safeParse(req.body);
    if (!recipeContentResult.success) {
      throw new InvalidInputError("Invalid input");
    }

    const { title, description, tags = [] } = recipeContentResult.data;
    const uniqueTags = [...new Set(tags)];

    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        userId: req.userId!,
        tags: {
          connectOrCreate: uniqueTags.map((tag) => ({
            where: { name: tag.name },
            create: { name: tag.name },
          })),
        },
      },
      include: { tags: true },
    });

    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// レシピ一覧
router.get("/", async (_req, res, next) => {
  try {
    const recipe = await prisma.recipe.findMany({
      include: { tags: true, user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// ユーザーのレシピ一覧
router.get("/my-recipes", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const recipe = await prisma.recipe.findMany({ where: { userId: req.userId! }, include: { comments: true } });

    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// レシピ詳細
router.get("/:id", async (req, res, next) => {
  try {
    const recipeIdResult = idSchema.safeParse({ id: req.params.id });
    if (!recipeIdResult.success) {
      throw recipeIdResult.error;
    }

    const { id } = recipeIdResult.data;

    const recipe = await prisma.recipe.findUnique({ where: { id }, include: { user: true, comments: true } });
    if (!recipe) {
      throw new NotFoundError("Recipe not found");
    }

    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// レシピ削除
router.delete("/:id", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const recipeIdResult = idSchema.safeParse({ id: req.params.id });
    if (!recipeIdResult.success) {
      throw recipeIdResult.error;
    }

    const { id } = recipeIdResult.data;

    const recipe = await prisma.recipe.findUnique({ where: { id }, include: { user: true, comments: true } });
    if (!recipe) {
      throw new NotFoundError("Recipe not found");
    }

    if (recipe.userId !== req.userId!) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.recipe.delete({ where: { id } });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// コメント投稿
const commentSchema = z.object({
  content: z.string().min(1, "コメントは必須です"),
});
router.post("/:id/comment", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const recipeIdResult = idSchema.safeParse({ id: req.params.id });
    if (!recipeIdResult.success) {
      throw recipeIdResult.error;
    }
    const { id: recipeId } = recipeIdResult.data;
    const commentResult = commentSchema.safeParse(req.body);

    if (!commentResult.success) {
      throw commentResult.error;
    }

    const { content } = commentResult.data;

    const comment = await prisma.comment.create({
      data: { content, recipeId, userId: req.userId! },
    });
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

// ------------------------------
// 将来的に追加予定（コメントメモ）
// ------------------------------
// - レシピ編集
// - タグ検索 / フィルタ
// - いいね機能
// - 投稿の統計情報（フォロー数、いいね数など）

export default router;
