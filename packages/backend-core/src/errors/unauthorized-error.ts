import { BaseError } from "./base-error";
import { ErrorResponse } from "../middleware/error-handler";

export class UnauthorizedError extends BaseError {
  statusCode: number = 401;

  constructor() {
    super();

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors(): ErrorResponse {
    return {
      errors: [
        {
          message: "Not Authorized",
        },
      ],
    };
  }
}
