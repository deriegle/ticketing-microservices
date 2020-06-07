import {Router, Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = Router();

router.post('/api/users/signup', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().isLength({min: 6}).withMessage('Password must be at least 6 characters'),
], (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  const { email, password } = req.body;

  console.log('Creating a user...');
  throw new DatabaseConnectionError();

  res.json({});
});

export const signUpRouter = router;