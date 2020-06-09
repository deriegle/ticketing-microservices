import { Router, Request, Response } from "express";
import { validateRequest, NotFoundError } from "@ticketing/backend-core";
import { param } from "express-validator";
import { Ticket } from "../models/ticket";

const router = Router();

router.get(
  "/api/tickets/:id",
  [param("id").trim().not().isEmpty()],
  validateRequest,
  async (req: Request<{ id: string }>, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    return res.send({
      ticket,
    });
  }
);

export const showTicketRouter = router;
