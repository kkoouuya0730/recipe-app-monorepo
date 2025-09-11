export class AppError extends Error {
  constructor(public statusCode: number, public message: string, public details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.details = details;
  }
}

export class InvalidInputError extends AppError {
  constructor(message: string, details?: unknown) {
    super(401, message, details);
  }
}
