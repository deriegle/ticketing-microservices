import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { DefaultError } from "../errors/default-error";

export interface ErrorResponse {
  errors: Array<{
    message: string;
    field?: string;
  }>
}

const defaultError = new DefaultError();

export const errorHandler = (
  err: RequestValidationError | DatabaseConnectionError | Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
): Response<ErrorResponse> => {
  if (err instanceof RequestValidationError) {
    return res.status(err.statusCode).json(err.serializeError());
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(err.statusCode).json(err.serializeError());
  }

  return res.status(defaultError.statusCode).json(defaultError.serializeError());
}