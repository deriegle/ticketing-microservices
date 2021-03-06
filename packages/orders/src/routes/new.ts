import { Response, Request, Router } from "express";
import mongoose from "mongoose";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  OrderStatus,
} from "@ticketing/backend-core";
import { body } from "express-validator";
import { Ticket } from "@ticketing/orders/src/models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();
const EXPIRATION_WINDOW_SECONDS = 1 * 60;

interface RequestBody {
  ticketId: string;
}

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
  async (req: Request<any, any, RequestBody>, res: Response) => {
    const ticket = await Ticket.findById(req.body.ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (await ticket.isReserved()) {
      throw new BadRequestError(
        `Ticket ${req.body.ticketId} is already reserved.`
      );
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = await Order.create({
      userId: req.currentUser!.userId,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version!,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.status(201).send({ order });
  }
);

export const newOrderRouter = router;
