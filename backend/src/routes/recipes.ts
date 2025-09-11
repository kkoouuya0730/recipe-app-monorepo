import { Router } from "express";
import { prisma } from "../prismaClient";
import { createRecipeInput } from "../validation/recipes.validation";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// レシピ作成
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const result = createRecipeInput.safeParse(req.body);
    if (!result.success) {
      throw result.error;
    }

    const { title, description, userId } = result.data;

    const recipe = await prisma.recipe.create({ data: { title, description, userId } });

    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// レシピ一覧
router.get("/", async (_req, res, next) => {
  try {
    const recipe = await prisma.recipe.findMany({ include: { user: true } });

    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

export default router;
