import { Router } from "express";
import { currentUser } from "../middleware/current-user";

const router = Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  return res.send({
    currentUser: req?.currentUser,
  });
});

export const currentUserRouter = router;
