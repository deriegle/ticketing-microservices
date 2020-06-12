import { Router, Request, Response } from "express";
import { validateRequest, requireAuth } from "@ticketing/backend-core";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";

const router = Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").trim().not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.create({
      price,
      title,
      userId: req.currentUser?.userId!,
    });

    await new TicketCreatedPublisher(client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
    });

    return res.status(201).send({
      ticket,
    });
  }
);

export const createTicketRouter = router;
