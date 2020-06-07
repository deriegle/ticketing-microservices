import {Router, Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '@ticketing/auth/src/models/user';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/api/users/signup', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().isLength({min: 6}).withMessage('Password must be at least 6 characters'),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  const { email, password } = req.body;

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new BadRequestError('Email or password invalid');
  }

  const user = await User.create({ email, password });

  const userJwt = jwt.sign({
    userId: user._id,
    email: user.email,
  }, 'asdf');

  req.session = {
    jwt: userJwt,
  } as any;

  return res.status(201).json({
    user: {
      id: user._id,
      email: user.email,
    },
    token: userJwt,
  })
});

export const signUpRouter = router;