import { Router } from "express";
import { prisma } from "../prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginUserInput, registerUserInput } from "../validation/auth.validation";
import { InvalidInputError } from "../errors/AppError";

const router = Router();

// サインアップ
router.post("/signup", async (req, res, next) => {
  try {
    const result = registerUserInput.safeParse(req.body);
    if (!result.success) {
      throw result.error;
    }

    const { name, email, password } = result.data;

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, name } });

    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    next(err);
  }
});

// ログイン
router.post("/login", async (req, res, next) => {
  try {
    const result = loginUserInput.safeParse(req.body);
    if (!result.success) {
      throw result.error;
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new InvalidInputError("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new InvalidInputError("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });

    res.json({ token, user: { id: user.id, name: user.name, createdAt: user.createdAt } });
  } catch (err) {
    next(err);
  }
});

export default router;
