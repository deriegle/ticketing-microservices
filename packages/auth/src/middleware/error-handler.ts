import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors/base-error";

export interface ErrorMessage {
  message: string;
  field?: string;
}

export interface ErrorResponse {
  errors: ErrorMessage[];
}

export const errorHandler = (
  err: BaseError | Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
): Response<ErrorResponse> => {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json(err.serializeErrors());
  }

  return res.status(400).json({
    errors: [
      {
        message: "Something went wrong.",
      },
    ],
  });
};
