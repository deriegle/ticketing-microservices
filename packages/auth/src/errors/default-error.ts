import { BaseError } from "./base-error";
import { ErrorResponse } from "../middleware/error-handler";

export class DefaultError extends Error implements BaseError {
  constructor() {
    super();

    Object.setPrototypeOf(this, DefaultError.prototype);
  }

  statusCode: number = 400;

  serializeError(): ErrorResponse {
    return {
      errors: [
        {
          message: 'Something went wrong',
        }
      ],
    };
  }
}