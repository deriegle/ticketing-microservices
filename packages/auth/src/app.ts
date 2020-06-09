import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "@ticketing/auth/src/routes/current-user";
import { signInRouter } from "@ticketing/auth/src/routes/signin";
import { signOutRouter } from "@ticketing/auth/src/routes/signout";
import { signUpRouter } from "@ticketing/auth/src/routes/signup";
import { NotFoundError, errorHandler } from "@ticketing/backend-core";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", async (req) => {
  console.log({
    url: req.url,
    currentUser: req.currentUser,
    cookie: req.headers.cookies,
  });

  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
