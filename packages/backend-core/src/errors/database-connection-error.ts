import { ErrorResponse } from "../middleware/error-handler";
import { BaseError } from "./base-error";

export class DatabaseConnectionError extends BaseError {
  public readonly reason = "Failed to connect to the database";
  public readonly statusCode = 500;

  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  public serializeErrors(): ErrorResponse {
    return {
      errors: [
        {
          message: this.reason,
        },
      ],
    };
  }
}
