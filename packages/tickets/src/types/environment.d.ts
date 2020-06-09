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

  namespace NodeJS {
    interface Global {
      signin: (email?: string) => string[];
    }

    interface ProcessEnv {
      JWT_KEY: string;
      MONGO_URI: string;
    }
  }
}

export { CurrentUserPayload };
