export class DatabaseConnectionError extends Error {
  public readonly reason = 'Failed to connect to the database';

  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}