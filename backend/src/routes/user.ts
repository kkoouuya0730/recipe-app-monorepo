import { Router } from "express";
import { prisma } from "../prismaClient";
import z from "zod";
import { NotFoundError } from "../errors/AppError";

const router = Router();

router.get("/:id", async (req, res, next) => {
  const schema = z.object({
    id: z.coerce.number().int().min(1),
  });
  try {
    const result = schema.safeParse({ id: req.params.id });
    if (!result.success) {
      throw result.error;
    }

    const { id } = result.data;

    const user = await prisma.user.findUnique({ where: { id: id }, select: { id: true, name: true, biography: true } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
