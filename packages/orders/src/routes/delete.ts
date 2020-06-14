import { Response, Request, Router } from "express";
import mongoose from "mongoose";
import {
  validateRequest,
  NotFoundError,
  UnauthorizedError,
  OrderStatus,
} from "@ticketing/backend-core";
import { param } from "express-validator";
import { Order } from "../models/order";

const router = Router();

router.delete(
  "/api/orders/:orderId",
  validateRequest,
  [
    param("orderId")
      .not()
      .isEmpty()
      .custom((orderId: string) => mongoose.Types.ObjectId.isValid(orderId))
      .withMessage("Order ID is required"),
  ],
  async (req: Request<{ orderId: string }>, res: Response) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.userId) {
      throw new UnauthorizedError();
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    res.status(204).send({ order });
  }
);

export const deleteOrderRouter = router;
