declare global {
  namespace NodeJS {
    interface Global {
      signin: (email?: string, password?: string) => Promise<string[]>;
    }

    interface ProcessEnv {
      JWT_KEY: string;
    }
  }
}

export {};
