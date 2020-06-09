import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.currentUser);
  if (!req.currentUser) {
    throw new UnauthorizedError();
  }

  next();
};
