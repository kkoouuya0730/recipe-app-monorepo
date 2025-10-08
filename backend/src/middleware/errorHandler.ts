import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import axios from "axios";
import { InvalidInputError, NotFoundError } from "../errors/AppError";

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.constructor.name);

  if (err instanceof ZodError) {
    console.error(err);
    axios
      .post(process.env.SLACK_WEBHOOK_URL!, {
        text: `❌ ZodError: Path: ${req.path}\nStack: ${err.stack}`,
      })
      .catch(() => {});
    return res.status(400).json({
      error: {
        code: 400,
        message: "Validation Error",
        details: err.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      },
    });
  }

  if (err instanceof InvalidInputError) {
    console.error(err);
    axios
      .post(process.env.SLACK_WEBHOOK_URL!, {
        text: `❌ InvalidInputError(${err.statusCode}): ${err.message}\nPath: ${req.path}\nStack: ${err.stack}`,
      })
      .catch(() => {});
    return res.status(err.statusCode).json({
      error: {
        code: err.statusCode,
        message: err.message,
      },
    });
  }

  if (err instanceof NotFoundError) {
    console.error(err);
    axios
      .post(process.env.SLACK_WEBHOOK_URL!, {
        text: `❌ NotFoundError(${err.statusCode}): ${err.message}\nPath: ${req.path}\nStack: ${err.stack}`,
      })
      .catch(() => {});
    return res.status(err.statusCode).json({
      error: {
        code: err.statusCode,
        message: err.message,
      },
    });
  }

  axios
    .post(process.env.SLACK_WEBHOOK_URL!, {
      text: `❌ Error: ${err.message}\nPath: ${req.path}\nStack: ${err.stack}`,
    })
    .catch(() => {});

  const message = err.message || "Internal Server Error";

  res.status(500).json({ error: { code: 500, message } });
};
