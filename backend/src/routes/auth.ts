import { Router } from "express";
import { prisma } from "../prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginUserInput, registerUserInput } from "../validation/auth.validation";
import { InvalidInputError } from "../errors/AppError";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

// アクセストークン発行
const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
};

// リフレッシュトークン発行
const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "7d" });
};

// サインアップ
router.post("/signup", async (req, res, next) => {
  try {
    const result = registerUserInput.safeParse(req.body);
    if (!result.success) {
      return next(result.error);
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
      return next(result.error);
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

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ user: { id: user.id, name: user.name, createdAt: user.createdAt } });
  } catch (err) {
    next(err);
  }
});

// アクセストークン再発行
router.post("/refresh", async (req, res, _next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new InvalidInputError("No refresh token");

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(403).json({ error: "Invalid or expired refresh token" });
    }

    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: number };
    const newAccessToken = generateAccessToken(payload.userId);
    const newRefreshToken = generateRefreshToken(payload.userId);

    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: payload.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ message: "Access token refreshed" });
  } catch (err) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }
});

// ログアウト
router.post("/logout", async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
});
export default router;
