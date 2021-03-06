import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError, validateRequest } from "@ticketing/backend-core";
import { User } from "../models/user";
import { PasswordService } from "../services/password-service";
import jwt from "jsonwebtoken";
import { CurrentUserPayload } from "@ticketing/backend-core/src/types/express";

const router = Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({
      email,
    });

    if (!existingUser) {
      throw new BadRequestError("Invalid email or password");
    }

    if (!(await PasswordService.compare(existingUser.password, password))) {
      throw new BadRequestError("Invalid email or password");
    }

    const userJwt = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
      } as Pick<CurrentUserPayload, "userId" | "email">,
      process.env.JWT_KEY
    );

    req.session = {
      jwt: userJwt,
    } as any;

    return res.status(200).json({
      user: existingUser,
      token: userJwt,
    });
  }
);

export const signInRouter = router;
