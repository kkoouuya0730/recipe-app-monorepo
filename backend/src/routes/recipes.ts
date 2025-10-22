import { Router } from "express";
import { prisma } from "../prismaClient";
import { createRecipeInput } from "../validation/recipes.validation";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import z from "zod";
import { NotFoundError } from "../errors/AppError";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const idSchema = z.object({
  id: z.coerce.number().int().min(1),
});

const s3 = new S3Client({ region: "ap-northeast-1" });
const BUCKET_NAME = process.env.AWS_S3_BUCKET!;

// レシピ作成
router.post("/", authMiddleware, upload.single("image"), async (req: AuthRequest, res, next) => {
  try {
    // formDataを型変換
    const raw = req.body;
    const parsedTags = raw.tags.map((tag: string) => {
      return {
        name: tag,
      };
    });

    const parsedFormData = {
      title: raw.title,
      description: raw.description,
      tags: parsedTags,
    };
    const recipeContentResult = createRecipeInput.safeParse(parsedFormData);
    if (!recipeContentResult.success) {
      return next(recipeContentResult.error);
    }

    const { title, description, tags } = recipeContentResult.data;
    const uniqueTags = [...new Set(tags)];

    let imageUrl: string | null = null;
    if (req.file) {
      const file = req.file;
      const key = `recipes/${Date.now()}_${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      await s3.send(command);
      imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        imageUrl,
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
      include: { tags: true, user: { select: { id: true, name: true } }, likes: true, comments: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// TODO レシピ検索結果

// ユーザーのレシピ一覧
router.get("/my-recipes", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const recipe = await prisma.recipe.findMany({
      where: { userId: req.userId! },
      include: { comments: true, likes: true },
    });

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
      return next(recipeIdResult.error);
    }

    const { id } = recipeIdResult.data;

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: { user: true, comments: true, likes: true },
    });
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
      return next(recipeIdResult.error);
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
      return next(recipeIdResult.error);
    }
    const { id: recipeId } = recipeIdResult.data;
    const commentResult = commentSchema.safeParse(req.body);

    if (!commentResult.success) {
      return next(commentResult.error);
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
