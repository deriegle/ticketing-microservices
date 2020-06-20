import { Router, Request, Response } from "express";
import { stripe } from "@ticketing/payments/src/stripe";
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
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

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

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    const payment = await Payment.create({
      orderId: order.id,
      stripeChargeId: charge.id,
    });

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: order.id,
      stripeChargeId: payment.stripeChargeId,
    });

    res.status(204).send({
      success: true,
      id: payment.id,
    });
  }
);

export const newChargeRouter = router;
