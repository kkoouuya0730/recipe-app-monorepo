import { Router } from "express";
import { prisma } from "../prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginUserInput, registerUserInput } from "../validation/auth.validation";

const router = Router();

// サインアップ
router.post("/signup", async (req, res) => {
  try {
    const result = registerUserInput.safeParse(req.body);
    if (!result.success) {
      throw Error;
    }
    const { name, email, password } = result.data;
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, name } });
    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Invalid input" });
  }
});

// ログイン
router.post("/login", async (req, res) => {
  try {
    const result = loginUserInput.safeParse(req.body);
    if (!result.success) {
      throw Error;
    }
    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Invalid input" });
  }
});

export default router;
