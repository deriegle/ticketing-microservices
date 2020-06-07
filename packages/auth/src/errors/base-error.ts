import { ErrorResponse } from "../middleware/error-handler";

export interface BaseError {
  serializeError: () => ErrorResponse,
}