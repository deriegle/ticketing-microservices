import { ErrorResponse } from "../middleware/error-handler";
import { BaseError } from "./base-error";

export class DatabaseConnectionError extends BaseError {
  public readonly reason = 'Failed to connect to the database';
  public readonly statusCode = 500;

  serializeErrors(): ErrorResponse {
    return {
      errors: [
        {
          message: this.reason,
        },
      ]
    };
  }
}