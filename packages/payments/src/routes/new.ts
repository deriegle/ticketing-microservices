import { Router, Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  UnauthorizedError,
  OrderStatus,
  BadRequestError,
} from "@ticketing/backend-core";
import { body } from "express-validator";
import { Order } from "../models/order";

const router = Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("orderId").not().isEmpty().withMessage("Order Id is required."),
    body("token").not().isEmpty().withMessage("Token is required."),
  ],
  validateRequest,
  async (
    req: Request<{}, {}, { token: string; orderId: string }>,
    res: Response
  ) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req?.currentUser?.userId) {
      throw new UnauthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Order has been cancelled");
    }

    res.send({ success: true });
  }
);

export const newChargeRouter = router;
