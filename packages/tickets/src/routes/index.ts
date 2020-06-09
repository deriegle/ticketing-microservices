import { Router, Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = Router();

router.get(
  "/api/tickets",
  async (req: Request<{ id: string }>, res: Response) => {
    const tickets = await Ticket.find({});

    return res.send({
      tickets,
    });
  }
);

export const indexTicketRouter = router;
