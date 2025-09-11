import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { InvalidInputError } from "../errors/AppError";

type JwtPayload = {
  userId: number;
};

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw new InvalidInputError("Authorization header missing");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new InvalidInputError("Token missing");
  }

  try {
    const secret = process.env.JWT_SECRET || "secret";
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.userId = decoded.userId;
    next(); // 忘れない
  } catch (error) {
    next(error);
  }
};
