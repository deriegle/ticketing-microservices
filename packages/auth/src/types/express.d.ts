
interface CurrentUserPayload {
  id: string;
  password: string;
  iat: number;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: CurrentUserPayload;
    }
  }
}

export { CurrentUserPayload }