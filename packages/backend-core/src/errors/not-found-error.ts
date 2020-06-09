import { BaseError } from "./base-error";
import { ErrorResponse } from "../middleware/error-handler";

export class NotFoundError extends BaseError {
  statusCode: number = 404;

  constructor() {
    super();

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): ErrorResponse {
    return {
      errors: [
        {
          message: "Not found",
        },
      ],
    };
  }
}
