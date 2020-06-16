import { Router, Request, Response } from "express";
import {
  validateRequest,
  requireAuth,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from "@ticketing/backend-core";
import { body, param } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    param("id").trim().not().isEmpty(),
    body("title").trim().not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request<{ id: string }>, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket?.userId !== req.currentUser?.userId) {
      throw new UnauthorizedError();
    }

    if (ticket.orderId) {
      throw new BadRequestError(
        "Cannot edit a ticket that is currently reserved."
      );
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version!,
    });

    return res.send({
      ticket,
    });
  }
);

export const updateTicketRouter = router;
