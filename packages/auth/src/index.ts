import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from 'cookie-session';
import jwt from 'jsonwebtoken';

import { currentUserRouter } from "@ticketing/auth/src/routes/current-user";
import { signInRouter } from "@ticketing/auth/src/routes/signin";
import { signOutRouter } from "@ticketing/auth/src/routes/signout";
import { signUpRouter } from "@ticketing/auth/src/routes/signup";
import { errorHandler } from "@ticketing/auth/src/middleware/error-handler";
import { NotFoundError } from "@ticketing/auth/src/errors/not-found-error";

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: true,
}));

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const init = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (e) {
    console.error(e);
  }

  app.listen(3000, () => console.log("@ticketing/auth listening on port 3000"));
};

init();
