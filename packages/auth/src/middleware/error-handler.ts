import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors/base-error";

export interface ErrorResponse {
  errors: Array<{
    message: string;
    field?: string;
  }>
}

export const errorHandler = (
  err: BaseError | Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
): Response<ErrorResponse> => {
  if (err instanceof BaseError) {
    console.log(err);
    return res.status(err.statusCode).json(err.serializeErrors());
  }

  return res.status(400).json({
    errors: [
      {
        message: 'Something went wrong.',
      }
    ]
  });
}