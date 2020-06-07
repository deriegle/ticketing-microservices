import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export interface ErrorResponse {
  errors: Array<{
    message: string;
    field?: string;
  }>
}

export const errorHandler = (
  err: RequestValidationError | DatabaseConnectionError | Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
): Response<ErrorResponse> => {
  if (err instanceof RequestValidationError) {
    return res.status(400).json(err.serializeError());
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(500).json(err.serializeError());
  }

  return res.status(400).json({
    errors: [
      {
        message: 'Something went wrong.',
      }
    ]
  });
}