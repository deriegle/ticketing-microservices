import {Router} from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const router = Router();

router.get(
  '/api/users/currentuser',
  async (req, res) => {
    if (!req.session?.jwt) {
      return res.status(400).json({
        currentUser: null,
      });
    }

    try {
      const payload =  jwt.verify(req.session.jwt, process.env.JWT_KEY!);

      return res.status(200).json({
        currentUser: payload,
      });
    } catch (err) {
      return res.status(400).json({
        currentUser: null,
      });
    }
  }
);

export const currentUserRouter = router;