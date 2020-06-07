import {Router, Request, Response} from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@ticketing/auth/src/middleware/validate-request';

const router = Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  (req: Request, res: Response) => {
  },
);

export const signInRouter = router;