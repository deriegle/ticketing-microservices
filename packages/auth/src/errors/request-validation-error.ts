import { ValidationError } from 'express-validator';
import { ErrorResponse } from '../middleware/error-handler';
import { BaseError } from './base-error';

export class RequestValidationError extends Error implements BaseError {
  public readonly statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super();

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError(): ErrorResponse {
    return {
      errors: this.errors.map((e) => ({
        message: e.msg,
        field: e.param,
      })),
    };
  }
}