import { Response, Request, Router } from "express";
import mongoose from "mongoose";
import {
  requireAuth,
  NotFoundError,
  UnauthorizedError,
} from "@ticketing/backend-core";
import { Order } from "../models/order";
import { param } from "express-validator";

const router = Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  [
    param("orderId")
      .not()
      .isEmpty()
      .custom((orderId: string) => mongoose.Types.ObjectId.isValid(orderId))
      .withMessage("Order ID is required"),
  ],
  async (req: Request<{ orderId: string }>, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.userId) {
      throw new UnauthorizedError();
    }

    res.send({ order });
  }
);

export const showOrderRouter = router;
