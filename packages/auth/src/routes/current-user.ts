import {Router} from 'express';
import { currentUser } from '../middleware/current-user';
import { requireAuth } from '../middleware/require-auth';

const router = Router();

router.get('/api/users/currentuser', currentUser, requireAuth, (req, res) => {
  res.status(req.currentUser ? 200 : 400).json({
    currentUser: req.currentUser,
  });
});

export const currentUserRouter = router;