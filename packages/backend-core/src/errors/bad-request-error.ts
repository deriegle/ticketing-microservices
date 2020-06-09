import { BaseError } from "./base-error";
import { ErrorResponse } from "../middleware/error-handler";

export class BadRequestError extends BaseError {
  public readonly statusCode = 400;

  constructor(public reason: string) {
    super();

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): ErrorResponse {
    return {
      errors: [
        {
          message: this.reason,
        },
      ],
    };
  }
}
