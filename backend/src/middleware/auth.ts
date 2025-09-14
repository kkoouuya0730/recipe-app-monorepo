import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { InvalidInputError } from "../errors/AppError";
import z from "zod";

export interface AuthRequest extends Request {
  userId?: number;
}

const idSchema = z.object({
  userId: z.coerce.number().int(),
});

const payloadSchema = z.object({
  userId: z.union([z.string(), z.number()]),
});

export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return next(new InvalidInputError("Authorization header missing"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new InvalidInputError("Token missing"));
  }

  try {
    const secret = process.env.JWT_SECRET || "secret";
    const decoded: unknown = jwt.verify(token, secret);

    if (typeof decoded === "string") {
      return next(new InvalidInputError("Invalid token payload"));
    }

    const parseResult = payloadSchema.safeParse(decoded);
    if (parseResult.error) {
      return next(new InvalidInputError("Unauthorized"));
    }

    const idCheck = idSchema.safeParse({ userId: parseResult.data.userId });
    if (idCheck.error) {
      return next(new InvalidInputError("Unauthorized"));
    }

    req.userId = idCheck.data.userId;
    next();
  } catch (error) {
    next(error);
  }
};
