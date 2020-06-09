interface CurrentUserPayload {
  userId: string;
  email: string;
  iat: number;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: CurrentUserPayload;
    }
  }
}

export { CurrentUserPayload };
