declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_KEY: string;
      MONGO_URI: string;
    }
  }
}

export {};
