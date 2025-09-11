import { Router } from "express";
import { prisma } from "../prismaClient";
import { createRecipeInput } from "../validation/recipes.validation";

const router = Router();

// レシピ作成
router.post("/", async (req, res) => {
  try {
    const result = createRecipeInput.safeParse(req.body);
    if (!result.success) {
      throw Error;
    }
    
    const { title, description, userId } = result.data;
    const recipe = await prisma.recipe.create({ data: { title, description, userId } });
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Invalid input" });
  }
});

// レシピ一覧
router.get("/", async (_req, res) => {
  try {
    const recipe = await prisma.recipe.findMany({ include: { user: true } });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Internal Server Error" });
  }
});

export default router;
