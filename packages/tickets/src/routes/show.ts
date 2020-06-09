import { Router, Request, Response } from "express";
import { validateRequest, NotFoundError } from "@ticketing/backend-core";
import { param } from "express-validator";
import { Ticket } from "../models/ticket";

const router = Router();

router.get(
  "/api/tickets/:id",
  [param("id").trim().not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const ticket = await Ticket.findOne({
        _id: id,
      });

      return res.status(200).send({
        ticket,
      });
    } catch (err) {
      throw new NotFoundError();
    }
  }
);

export const showTicketRouter = router;
