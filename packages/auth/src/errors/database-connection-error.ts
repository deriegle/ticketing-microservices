import { ErrorResponse } from "../middleware/error-handler";
import { BaseError } from "./base-error";

export class DatabaseConnectionError extends Error implements BaseError {
  public readonly reason = 'Failed to connect to the database';

  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeError(): ErrorResponse {
    return {
      errors: [
        {
          message: this.reason,
        },
      ]
    };
  }
}