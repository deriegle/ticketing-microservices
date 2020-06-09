import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { CurrentUserPayload } from "../types/environment";
import jwt from "jsonwebtoken";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  process.env.JWT_KEY = "1234";
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id: string = "1234"): string[] => {
  const userPayload: CurrentUserPayload = {
    iat: new Date().getTime(),
    id,
    email: "test@test.com",
  };

  const token = jwt.sign(userPayload, process.env.JWT_KEY);
  const session = JSON.stringify({ jwt: token });
  const encodedSession = Buffer.from(session).toString("base64");

  return [`express:sess=${encodedSession}`];
};
