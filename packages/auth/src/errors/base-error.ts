import { ErrorResponse } from "../middleware/error-handler";

export interface BaseError {
  statusCode: number;
  serializeError: () => ErrorResponse,
}