import {Router, Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '@ticketing/auth/src/models/user';
import { RequestValidationError } from '../errors/request-validation-error';

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
    console.log('Email in use');
    return res.json({});
  }

  const user = await User.create({ email, password });

  return res.status(201).json({
    user,
  })
});

export const signUpRouter = router;