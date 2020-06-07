import {Router} from 'express';

const router = Router();

router.post('/api/users/signin', (req, res) => {
  res.send('hello, there');
});

export const signInRouter = router;