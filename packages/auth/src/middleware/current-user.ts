import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { CurrentUserPayload } from "@ticketing/auth/src/types/express";

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY) as CurrentUserPayload;

    req.currentUser = payload;
  } catch (error) {}

  next();
};