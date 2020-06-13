import { Router, Request, Response } from "express";
import {
  validateRequest,
  requireAuth,
  NotFoundError,
  UnauthorizedError,
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

    console.log({
      currentUser: req.currentUser,
    });

    if (ticket?.userId !== req.currentUser?.userId) {
      throw new UnauthorizedError();
    }

    if (!ticket) {
      throw new NotFoundError();
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
    });

    return res.send({
      ticket,
    });
  }
);

export const updateTicketRouter = router;
