import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { User } from "@ticketing/auth/src/models/user";
import { BadRequestError } from "@ticketing/auth/src/errors/bad-request-error";
import jwt from "jsonwebtoken";
import { validateRequest } from "@ticketing/auth/src/middleware/validate-request";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      throw new BadRequestError("Email or password invalid");
    }

    const user = await User.create({ email, password });

    const userJwt = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_KEY
    );

    req.session = {
      jwt: userJwt,
    } as any;

    return res.status(201).json({
      user,
      token: userJwt,
    });
  }
);

export const signUpRouter = router;
