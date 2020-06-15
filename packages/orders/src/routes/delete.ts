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
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

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
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.userId) {
      throw new UnauthorizedError();
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version!,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send({ order });
  }
);

export const deleteOrderRouter = router;
