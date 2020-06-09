declare global {
  namespace Express {
    interface Request {
      currentUser?: CurrentUserPayload;
    }
  }

  namespace NodeJS {
    interface Global {
      signin: (email?: string, password?: string) => Promise<string[]>;
    }

    interface ProcessEnv {
      JWT_KEY: string;
      MONGO_URI: string;
    }
  }
}

export {};
