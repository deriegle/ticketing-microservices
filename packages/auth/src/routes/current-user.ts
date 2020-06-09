import { Router } from "express";
import { currentUser } from "@ticketing/backend-core";

const router = Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  return res.send({
    currentUser: req?.currentUser,
  });
});

export const currentUserRouter = router;
