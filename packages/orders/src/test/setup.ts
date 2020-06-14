import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { CurrentUserPayload } from "@ticketing/backend-core/src/types/express";
import jwt from "jsonwebtoken";

jest.mock("@ticketing/orders/src/nats-wrapper");

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  process.env.JWT_KEY = "1234";
}, 100000);

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

declare global {
  namespace NodeJS {
    interface Global {
      signin: (id?: string) => string[];
    }

    interface ProcessEnv {
      JWT_KEY: string;
      MONGO_URI: string;
    }
  }
}

global.signin = (userId: string = "1234"): string[] => {
  const userPayload: CurrentUserPayload = {
    iat: new Date().getTime(),
    userId,
    email: "test@test.com",
  };

  const token = jwt.sign(userPayload, process.env.JWT_KEY);
  const session = JSON.stringify({ jwt: token });
  const encodedSession = Buffer.from(session).toString("base64");

  return [`express:sess=${encodedSession}`];
};
