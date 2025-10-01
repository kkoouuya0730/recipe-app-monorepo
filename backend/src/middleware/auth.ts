import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { InvalidInputError } from "../errors/AppError";
import z from "zod";
import { prisma } from "../prismaClient";

export interface AuthRequest extends Request {
  userId?: number;
}

const idSchema = z.object({
  userId: z.coerce.number().int(),
});

const payloadSchema = z.object({
  userId: z.union([z.string(), z.number()]),
});

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  try {
    if (accessToken) {
      // accessToken があれば検証
      const decoded = jwt.verify(accessToken, JWT_SECRET);
      const parseResult = payloadSchema.safeParse(decoded);
      if (!parseResult.success) throw new Error("Invalid access token");
      const idCheck = idSchema.safeParse({ userId: parseResult.data.userId });
      if (!idCheck.success) throw new Error("Invalid access token payload");

      req.userId = idCheck.data.userId;
      return next();
    }

    if (!refreshToken) throw new InvalidInputError("No refresh token");

    // DB に存在して有効か確認
    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(403).json({ error: "Invalid or expired refresh token" });
    }

    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: number };
    const idCheck = idSchema.safeParse({ userId: payload.userId });
    if (!idCheck.success) throw new Error("Invalid refresh token payload");

    // 新しい accessToken 発行
    const newAccessToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, { expiresIn: "15m" });
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    req.userId = payload.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // アクセストークン期限切れ
      return res.status(401).json({ error: "Access token expired" });
    }
    next(error);
  }
};
