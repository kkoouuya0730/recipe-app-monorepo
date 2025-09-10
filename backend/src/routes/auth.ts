import { Router } from "express";
import { prisma } from "../prismaClient";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// サインアップ
router.post("/signup", async (req, res) => {
  const schema = z.object({
    email: z.email(),
    password: z.string().min(6),
    name: z.string().min(1),
  });

  try {
    const { email, password, name } = schema.parse(req.body);
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, name } });
    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Invalid input" });
  }
});

// ログイン
router.post("/login", async (req, res) => {
  const schema = z.object({ email: z.email(), password: z.string().min(6) });
  try {
    const { email, password } = schema.parse(req.body);
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
