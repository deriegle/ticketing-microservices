import { Response, Request, Router } from "express";
import mongoose from "mongoose";
import { requireAuth, validateRequest } from "@ticketing/backend-core";
import { body } from "express-validator";

const router = Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket ID must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({ order: [] });
  }
);

export const newOrderRouter = router;
