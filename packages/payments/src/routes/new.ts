import { Router, Request, Response } from "express";
import { requireAuth, validateRequest } from "@ticketing/backend-core";
import { body } from "express-validator";

const router = Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("orderId").not().isEmpty().withMessage("Order Id is required."),
    body("token").not().isEmpty().withMessage("Token is required."),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    res.send({ success: true });
  }
);

export const newChargeRouter = router;
